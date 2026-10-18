import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const sourceDirectory = path.join(projectRoot, 'src');
const outputDirectory = path.join(projectRoot, 'dist');
const requiredFiles = [
  path.join(projectRoot, 'content', 'ROADMAP.md'),
  path.join(projectRoot, 'public', 'styles.css'),
  path.join(sourceDirectory, 'server.js'),
];

for (const file of requiredFiles) await fs.access(file);
await fs.rm(outputDirectory, { force: true, recursive: true });
await fs.cp(sourceDirectory, outputDirectory, { recursive: true });
console.log('Build complete: application source copied to dist/.');
