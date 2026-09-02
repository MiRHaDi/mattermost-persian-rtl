import {copyFile, cp, mkdir, readFile, readdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import * as tar from 'tar';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distributionDirectory = path.resolve(repositoryRoot, 'dist');
const stageDirectory = path.join(distributionDirectory, 'stage');
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, 'plugin.json'), 'utf8'));
const pluginDirectory = path.join(stageDirectory, manifest.id);
const webappDirectory = path.join(pluginDirectory, 'webapp', 'dist');
const bundleName = `${manifest.id}-${manifest.version}.tar.gz`;
const bundlePath = path.join(distributionDirectory, bundleName);

if (path.dirname(distributionDirectory) !== path.resolve(repositoryRoot)) {
  throw new Error('Refusing to package outside the repository root.');
}

await rm(distributionDirectory, {recursive: true, force: true});
await mkdir(webappDirectory, {recursive: true});

for (const file of [
  'plugin.json',
  'LICENSE',
  'README.md',
  'README.fa.md',
  'NOTICE.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'compatibility.json',
]) {
  await copyFile(path.join(repositoryRoot, file), path.join(pluginDirectory, file));
}
await cp(path.join(repositoryRoot, 'docs'), path.join(pluginDirectory, 'docs'), {recursive: true});
await copyFile(
  path.join(repositoryRoot, 'webapp', 'dist', 'main.js'),
  path.join(webappDirectory, 'main.js'),
);

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath)));
    } else if (entry.isFile()) {
      files.push(path.relative(stageDirectory, absolutePath).split(path.sep).join('/'));
    } else {
      throw new Error(`Refusing to package non-file entry: ${absolutePath}`);
    }
  }
  return files.sort((left, right) => left.localeCompare(right, 'en'));
}

const archiveMembers = await listFiles(pluginDirectory);

await tar.c(
  {
    cwd: stageDirectory,
    file: bundlePath,
    gzip: true,
    mtime: new Date(0),
    portable: true,
  },
  archiveMembers,
);

await rm(stageDirectory, {recursive: true, force: true});
console.log(`Created ${path.relative(repositoryRoot, bundlePath)}`);
