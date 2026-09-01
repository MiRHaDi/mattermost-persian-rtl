import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

import {build} from 'esbuild';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(repositoryRoot, 'webapp', 'dist');

await mkdir(outputDirectory, {recursive: true});
await build({
  entryPoints: [path.join(repositoryRoot, 'webapp', 'src', 'index.ts')],
  outfile: path.join(outputDirectory, 'main.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome109', 'firefox115', 'safari16.4'],
  minify: true,
  sourcemap: false,
  legalComments: 'eof',
  logLevel: 'info',
});
