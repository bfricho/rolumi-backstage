import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const configPath = path.join(projectRoot, 'content.config.json');
const contentConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
const sourceRoot = path.resolve(projectRoot, contentConfig.sourceRoot);
const destinationRoot = path.join(projectRoot, 'content');
const excludedPaths = (contentConfig.exclude ?? []).map((entry) => path.resolve(sourceRoot, entry));

if (destinationRoot === sourceRoot || sourceRoot.startsWith(`${destinationRoot}${path.sep}`)) {
  throw new Error('Unsafe content sync configuration.');
}

await fs.rm(destinationRoot, { force: true, recursive: true });
await fs.mkdir(destinationRoot, { recursive: true });

for (const entry of contentConfig.include) {
  if (path.isAbsolute(entry) || entry.split('/').includes('..')) throw new Error(`Unsafe include path: ${entry}`);
  const source = path.join(sourceRoot, entry);
  const destination = path.join(destinationRoot, entry);
  await fs.cp(source, destination, {
    recursive: true,
    filter: (candidate) => {
      if (['.DS_Store', 'node_modules'].includes(path.basename(candidate))) return false;
      const absolute = path.resolve(candidate);
      return !excludedPaths.some((excluded) => absolute === excluded || absolute.startsWith(`${excluded}${path.sep}`));
    },
  });
}

console.log(`Content snapshot refreshed from ${sourceRoot}.`);
