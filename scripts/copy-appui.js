const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function shouldSkip(name) {
  if (name === '__MACOSX') return true;
  if (name.startsWith('._')) return true;
  return false;
}

function copyDir(src, dest) {
  ensureDir(dest);
  const items = fs.readdirSync(src, { withFileTypes: true });
  for (const item of items) {
    if (shouldSkip(item.name)) continue;
    const s = path.join(src, item.name);
    const d = path.join(dest, item.name);
    if (item.isDirectory()) {
      copyDir(s, d);
    } else if (item.isFile()) {
      fs.copyFileSync(s, d);
    }
  }
}

function main() {
  const src = path.resolve(process.cwd(), 'appui', 'appui');
  const dest = path.resolve(process.cwd(), 'public', 'appui');
  ensureDir(path.resolve(process.cwd(), 'public'));
  copyDir(src, dest);
  console.log('Copied static appui to', dest);
}

main();
