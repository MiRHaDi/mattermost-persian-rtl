import {access, readdir, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const markdownFiles = [];

async function collectMarkdown(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) {
      continue;
    }
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectMarkdown(absolutePath);
    } else if (entry.name.endsWith('.md')) {
      markdownFiles.push(absolutePath);
    }
  }
}

await collectMarkdown(repositoryRoot);
let checkedLinks = 0;

for (const markdownFile of markdownFiles) {
  const source = await readFile(markdownFile, 'utf8');
  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1]?.trim();
    if (!target || /^(?:https?:|mailto:|#)/i.test(target)) {
      continue;
    }
    const withoutFragment = target.split('#', 1)[0];
    if (!withoutFragment) {
      continue;
    }
    await access(path.resolve(path.dirname(markdownFile), withoutFragment));
    checkedLinks += 1;
  }
}

console.log(`Verified ${checkedLinks} local links across ${markdownFiles.length} Markdown files.`);
