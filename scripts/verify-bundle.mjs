import {mkdir, readFile, rm, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

import {JSDOM} from 'jsdom';
import * as tar from 'tar';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, 'plugin.json'), 'utf8'));
const bundlePath = path.join(
  repositoryRoot,
  'dist',
  `${manifest.id}-${manifest.version}.tar.gz`,
);
const extractionDirectory = path.join(repositoryRoot, 'dist', '.verify');
const expected = [
  `${manifest.id}/plugin.json`,
  `${manifest.id}/webapp/dist/main.js`,
  `${manifest.id}/LICENSE`,
  `${manifest.id}/README.md`,
  `${manifest.id}/README.fa.md`,
  `${manifest.id}/NOTICE.md`,
  `${manifest.id}/SECURITY.md`,
  `${manifest.id}/CHANGELOG.md`,
  `${manifest.id}/docs/SCOPE.md`,
  `${manifest.id}/docs/SCOPE.fa.md`,
  `${manifest.id}/docs/AUDIT.md`,
  `${manifest.id}/docs/AUDIT.fa.md`,
];
const entries = [];

await tar.t({
  file: bundlePath,
  onentry(entry) {
    entries.push(entry.path.replace(/\/$/, ''));
  },
});

for (const requiredPath of expected) {
  if (!entries.includes(requiredPath)) {
    throw new Error(`Bundle is missing ${requiredPath}`);
  }
}

const bundle = await stat(bundlePath);
if (bundle.size === 0) {
  throw new Error('Bundle is empty.');
}

await rm(extractionDirectory, {recursive: true, force: true});
await mkdir(extractionDirectory, {recursive: true});
await tar.x({file: bundlePath, cwd: extractionDirectory});

const packagedRoot = path.join(extractionDirectory, manifest.id);
const packagedManifest = JSON.parse(await readFile(path.join(packagedRoot, 'plugin.json'), 'utf8'));
const packagedWebapp = await readFile(path.join(packagedRoot, 'webapp', 'dist', 'main.js'), 'utf8');
if (packagedManifest.id !== manifest.id || packagedManifest.version !== manifest.version) {
  throw new Error('Packaged manifest does not match the source manifest.');
}
if (packagedManifest.webapp?.bundle_path !== 'webapp/dist/main.js') {
  throw new Error('Packaged manifest has an unexpected webapp bundle path.');
}
if (!packagedWebapp.includes('registerPlugin')) {
  throw new Error('Packaged webapp bundle does not register a Mattermost plugin.');
}

const dom = new JSDOM(`<!doctype html><html><head></head><body>
  <div class="post-message__text" dir="auto"><p>@everyone سلام</p></div>
</body></html>`);
let registeredId;
let registeredPlugin;
let rootComponent;
let rootCleanup;
dom.window.React = {
  useEffect(effect) {
    rootCleanup = effect();
  },
};
dom.window.registerPlugin = (pluginId, plugin) => {
  registeredId = pluginId;
  registeredPlugin = plugin;
};

vm.runInNewContext(packagedWebapp, {
  window: dom.window,
  document: dom.window.document,
  MutationObserver: dom.window.MutationObserver,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement,
  Node: dom.window.Node,
  console,
});

if (registeredId !== manifest.id || typeof registeredPlugin?.initialize !== 'function') {
  throw new Error('Built bundle did not register the expected plugin class.');
}
registeredPlugin.initialize({
  registerRootComponent(component) {
    rootComponent = component;
    return 'bundle-smoke-root';
  },
});
if (typeof rootComponent !== 'function') {
  throw new Error('Plugin did not register its root component.');
}
rootComponent();
const fixtureMessage = dom.window.document.querySelector('.post-message__text');
if (fixtureMessage?.getAttribute('dir') !== 'rtl') {
  throw new Error('Built bundle did not apply RTL to the Persian message fixture.');
}
if (typeof rootCleanup !== 'function') {
  throw new Error('Root component did not register lifecycle cleanup.');
}
rootCleanup();
if (fixtureMessage.getAttribute('dir') !== 'auto') {
  throw new Error('Built bundle did not restore the original message direction.');
}
registeredPlugin.uninitialize();
dom.window.close();

await rm(extractionDirectory, {recursive: true, force: true});

console.log(`Verified ${expected.length} required files and plugin lifecycle smoke in ${path.basename(bundlePath)} (${bundle.size} bytes).`);
