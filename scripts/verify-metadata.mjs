import {access, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, 'plugin.json'), 'utf8'));
const packageMetadata = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'));
const compatibility = JSON.parse(
  await readFile(path.join(repositoryRoot, 'compatibility.json'), 'utf8'),
);
const securityPolicy = await readFile(path.join(repositoryRoot, 'SECURITY.md'), 'utf8');
const issueConfig = await readFile(
  path.join(repositoryRoot, '.github', 'ISSUE_TEMPLATE', 'config.yml'),
  'utf8',
);
const releaseWorkflow = await readFile(
  path.join(repositoryRoot, '.github', 'workflows', 'release.yml'),
  'utf8',
);

function requireValue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

requireValue(manifest.id === 'ir.mirhadi.mattermost-persian-rtl', 'Unexpected plugin ID.');
requireValue(manifest.version === packageMetadata.version, 'Package and plugin versions differ.');
requireValue(manifest.version === compatibility.plugin_version, 'Compatibility version differs.');
requireValue(
  manifest.min_server_version === compatibility.minimum_server_version,
  'Compatibility minimum server version differs.',
);
requireValue(/^\d+\.\d+\.\d+$/.test(manifest.version), 'Plugin version is not stable SemVer.');
requireValue(
  /^\d+\.\d+\.\d+$/.test(manifest.min_server_version),
  'Minimum server version is not stable SemVer.',
);
requireValue(
  manifest.homepage_url === 'https://github.com/MiRHaDi/mattermost-persian-rtl',
  'Unexpected homepage URL.',
);
requireValue(manifest.support_url === `${manifest.homepage_url}/issues`, 'Unexpected support URL.');
requireValue(
  manifest.release_notes_url === `${manifest.homepage_url}/releases/tag/v${manifest.version}`,
  'Release notes URL does not match the plugin version.',
);
requireValue(manifest.webapp?.bundle_path === 'webapp/dist/main.js', 'Unexpected bundle path.');
requireValue(!Object.hasOwn(manifest, 'server'), 'This webapp-only plugin must not gain a server binary.');
requireValue(compatibility.release_channel === 'beta', 'Unreviewed release must remain Beta.');
requireValue(Array.isArray(compatibility.live_matrix), 'Live matrix must be an array.');
requireValue(Array.isArray(compatibility.unverified_claims), 'Unverified claims must be explicit.');
requireValue(
  compatibility.live_matrix.length === 0 && compatibility.release_channel === 'beta',
  'A release without live-server rows must remain Beta.',
);

const privateSecurityUrl = `${manifest.homepage_url}/security/advisories/new`;
requireValue(securityPolicy.includes(privateSecurityUrl), 'Security policy lacks private report URL.');
requireValue(issueConfig.includes(privateSecurityUrl), 'Issue config lacks private security route.');
requireValue(
  /tags:\s*\['v\*'\]/.test(releaseWorkflow),
  'Release workflow must be tag-triggered.',
);
requireValue(
  releaseWorkflow.includes("github.repository == 'MiRHaDi/mattermost-persian-rtl'"),
  'Release workflow must be restricted to the intended repository.',
);
requireValue(!/^\s*schedule:/m.test(releaseWorkflow), 'Release workflow must not be scheduled.');

for (const [name, upstream] of Object.entries(compatibility.upstream)) {
  requireValue(/^https:\/\/github\.com\//.test(upstream.repository), `${name} repository is invalid.`);
  requireValue(/^[0-9a-f]{40}$/.test(upstream.commit), `${name} commit is not a full SHA.`);
}

for (const required of [
  'README.md',
  'README.fa.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'compatibility.json',
  'docs/COMPATIBILITY.md',
  'docs/COMPATIBILITY.fa.md',
  'docs/RELEASING.md',
  'docs/RELEASE_NOTES.md',
  'docs/MARKETPLACE_SUBMISSION.md',
]) {
  await access(path.join(repositoryRoot, required));
}

console.log(
  `Verified release metadata for ${manifest.id}@${manifest.version} (${compatibility.release_channel}).`,
);
