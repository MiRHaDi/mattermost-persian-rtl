import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, 'plugin.json'), 'utf8'));
const archivePath = path.join(
  repositoryRoot,
  'dist',
  `${manifest.id}-${manifest.version}.tar.gz`,
);

function packageAndHash() {
  execFileSync(process.execPath, [path.join(repositoryRoot, 'scripts', 'package.mjs')], {
    cwd: repositoryRoot,
    stdio: 'pipe',
  });
  return readFile(archivePath).then((archive) =>
    createHash('sha256').update(archive).digest('hex'),
  );
}

const first = await packageAndHash();
const second = await packageAndHash();
if (first !== second) {
  throw new Error(`Package is not reproducible: ${first} != ${second}`);
}

console.log(`Verified reproducible archive SHA-256 ${first}.`);
