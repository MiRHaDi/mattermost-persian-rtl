import {createHash} from 'node:crypto';
import {readFile, stat, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(repositoryRoot, 'plugin.json'), 'utf8'));
const packageMetadata = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'));
const compatibilityPath = path.join(repositoryRoot, 'compatibility.json');
const compatibility = JSON.parse(await readFile(compatibilityPath, 'utf8'));

if (manifest.version !== packageMetadata.version || manifest.version !== compatibility.plugin_version) {
  throw new Error('plugin.json, package.json, and compatibility.json versions must match.');
}
if (manifest.min_server_version !== compatibility.minimum_server_version) {
  throw new Error('Manifest and compatibility minimum server versions must match.');
}

const archiveName = `${manifest.id}-${manifest.version}.tar.gz`;
const archivePath = path.join(repositoryRoot, 'dist', archiveName);
const archive = await readFile(archivePath);
const archiveStat = await stat(archivePath);
const archiveSha256 = createHash('sha256').update(archive).digest('hex');
const compatibilitySha256 = createHash('sha256')
  .update(await readFile(compatibilityPath))
  .digest('hex');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
}).trim();

const releaseManifest = {
  schema_version: 1,
  plugin_id: manifest.id,
  plugin_version: manifest.version,
  release_channel: compatibility.release_channel,
  minimum_server_version: manifest.min_server_version,
  source_repository: manifest.homepage_url,
  source_commit: sourceCommit,
  release_url: manifest.release_notes_url,
  archive: {
    name: archiveName,
    bytes: archiveStat.size,
    sha256: archiveSha256,
  },
  compatibility: {
    path: 'compatibility.json',
    sha256: compatibilitySha256,
    audited_at: compatibility.audited_at,
  },
};

await writeFile(
  path.join(repositoryRoot, 'dist', 'release-manifest.json'),
  `${JSON.stringify(releaseManifest, null, 2)}\n`,
  'utf8',
);
await writeFile(
  path.join(repositoryRoot, 'dist', 'SHA256SUMS'),
  `${archiveSha256}  ${archiveName}\n`,
  'utf8',
);

console.log(`Prepared ${archiveName} (${archiveStat.size} bytes, sha256 ${archiveSha256}).`);
