/**
 * Sync docs/ sang i18n/{en,vi}/docusaurus-plugin-content-docs/current/
 * Chỉ copy .md, .mdx và _category_.json (nội dung + nhãn category theo locale).
 * Không copy _category.json và _articles.json — chỉ dùng trong docs/, không cần trong i18n.
 * Chạy: node scripts/sync-docs-i18n.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const I18N_VI_DOCS = path.join(
  ROOT,
  'i18n',
  'vi',
  'docusaurus-plugin-content-docs',
  'current'
);
const I18N_EN_DOCS = path.join(
  ROOT,
  'i18n',
  'en',
  'docusaurus-plugin-content-docs',
  'current'
);

function syncDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(srcDir, e.name);
    const destPath = path.join(destDir, e.name);
    if (e.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      syncDir(srcPath, destPath);
    } else if (
      e.isFile() &&
      (e.name.endsWith('.md') ||
        e.name.endsWith('.mdx') ||
        e.name === '_category_.json' ||
        e.name === '_category_.yml')
    ) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(DOCS)) {
  console.log('[sync-docs-i18n] No docs/ folder, skip.');
  process.exit(0);
}

// Sync cho vi
fs.mkdirSync(I18N_VI_DOCS, { recursive: true });
syncDir(DOCS, I18N_VI_DOCS);
console.log('[sync-docs-i18n] Synced docs/ -> i18n/vi/.../current/');

// Sync cho en (giữ i18n/en đồng bộ với docs/)
fs.mkdirSync(I18N_EN_DOCS, { recursive: true });
syncDir(DOCS, I18N_EN_DOCS);
console.log('[sync-docs-i18n] Synced docs/ -> i18n/en/.../current/');

console.log('[sync-docs-i18n] Nội dung docs đang dùng chung cho locale en + vi.');
