/**
 * Chuẩn hóa nội dung .md/.mdx trong docs/ (và i18n khi sync) để tránh lỗi MDX:
 * - Thay URL trong ngoặc nhọn <https://...> hoặc <http://...> bằng link Markdown [url](url).
 *   MDX coi <...> là JSX nên ký tự / trong URL gây lỗi "Unexpected character `/`".
 * Chạy: node scripts/normalize-docs-mdx.js (đã gắn vào build/sync).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const I18N_VI_DOCS = path.join(ROOT, 'i18n', 'vi', 'docusaurus-plugin-content-docs', 'current');

/** Thay <http(s)://...> bằng [url](url) để MDX không parse nhầm thành JSX. */
function normalizeAngleBracketUrls(text) {
  return text.replace(/<(https?:\/\/[^>]+)>/g, (_, url) => `[${url}](${url})`);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const normalized = normalizeAngleBracketUrls(content);
  if (normalized !== content) {
    fs.writeFileSync(filePath, normalized, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dirPath, onFile) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dirPath, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) {
      walkDir(fullPath, onFile);
    } else if (
      e.isFile() &&
      (e.name.endsWith('.md') || e.name.endsWith('.mdx'))
    ) {
      onFile(fullPath);
    }
  }
}

let count = 0;
walkDir(DOCS, (filePath) => {
  if (processFile(filePath)) {
    count++;
    console.log('[normalize-docs-mdx] Fixed', path.relative(ROOT, filePath));
  }
});
if (fs.existsSync(I18N_VI_DOCS)) {
  walkDir(I18N_VI_DOCS, (filePath) => {
    if (processFile(filePath)) {
      count++;
      console.log('[normalize-docs-mdx] Fixed', path.relative(ROOT, filePath));
    }
  });
}
if (count > 0) {
  console.log('[normalize-docs-mdx] Normalized', count, 'file(s) (<url> → [url](url)).');
} else {
  console.log('[normalize-docs-mdx] No changes (docs/ and i18n/.../current/).');
}
