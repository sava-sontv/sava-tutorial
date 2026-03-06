/**
 * Một file _articles.json mỗi folder docs/<folder>/:
 * [ { "id": "tên-file-không-ext", "active": true, "sort": 5 }, ... ]
 * sort nhảy bước 5 (5, 10, 15, 20, ...). Tự sinh/cập nhật khi thêm hay sửa file .md.
 * Script này chỉ quản lý _articles.json (tự động tạo/cập nhật khi có file .md mới).
 * Sidebar được generate bởi generate-sidebar.js đọc trực tiếp từ _articles.json.
 * Chạy: node scripts/apply-articles-json.js (đã gắn vào start/build).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const ARTICLES_FILE = '_articles.json';
const SORT_STEP = 5;

function getMdFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() &&
        (e.name.endsWith('.md') || e.name.endsWith('.mdx')) &&
        !e.name.startsWith('_')
    )
    .map((e) => e.name);
}

function getIdFromFilename(name) {
  return name.replace(/\.(md|mdx)$/i, '');
}

/** Đọc slug từ frontmatter (nếu có) để khớp ensure-category-json; tránh thêm entry trùng theo tên file. */
function getSlugFromMdFile(sectionPath, filename) {
  const filePath = path.join(sectionPath, filename);
  if (!fs.existsSync(filePath)) return getIdFromFilename(filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return getIdFromFilename(filename);
    const fm = match[1];
    const slugMatch = fm.match(/^slug:\s*['"]?([^'"\r\n]+)['"]?\s*$/m) || fm.match(/^slug:\s*(.+)$/m);
    if (slugMatch && slugMatch[1]) return slugMatch[1].trim();
  } catch (_) {}
  return getIdFromFilename(filename);
}

function readArticlesJson(dirPath) {
  const filePath = path.join(dirPath, ARTICLES_FILE);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : null;
    } catch {
      return null;
    }
  }
  const oldPath = path.join(dirPath, '_articles_.json');
  if (fs.existsSync(oldPath)) {
    try {
      const arr = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
      if (!Array.isArray(arr)) return null;
      const items = arr.map((entry, i) => ({
        id: entry.id != null ? String(entry.id) : null,
        active: typeof entry.active === 'boolean' ? entry.active : true,
        sort: typeof entry.sort === 'number' ? entry.sort : (i + 1) * SORT_STEP,
      })).filter((e) => e.id);
      if (items.length === 0) return null;
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
      console.log('[apply-articles-json] Wrote', path.relative(ROOT, filePath), '(migrate từ _articles_.json)');
      try { fs.unlinkSync(oldPath); } catch (_) {}
      return items;
    } catch {
      return null;
    }
  }
  return null;
}

function writeArticlesJson(dirPath, items) {
  const filePath = path.join(dirPath, ARTICLES_FILE);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
  console.log('[apply-articles-json] Wrote', path.relative(ROOT, filePath));
}

function applyArticlesToFolder(dirPath) {
  const mdFiles = getMdFiles(dirPath);
  if (mdFiles.length === 0) return;

  let items = readArticlesJson(dirPath);
  if (!items || items.length === 0) {
    ensureArticlesJson(dirPath);
    items = readArticlesJson(dirPath) || [];
  }

  const idToEntry = new Map();
  for (const e of items) {
    if (e.id != null) idToEntry.set(e.id, { ...e });
    const idLower = String(e.id).toLowerCase();
    if (!idToEntry.has(idLower)) idToEntry.set(idLower, { ...e });
  }

  const existingIds = new Set(items.map((e) => e.id));
  let maxSort = 0;
  for (const e of items) {
    if (typeof e.sort === 'number' && e.sort > maxSort) maxSort = e.sort;
  }
  if (maxSort === 0) maxSort = (items.length || 1) * SORT_STEP;

  const added = [];
  for (const filename of mdFiles) {
    const fileId = getIdFromFilename(filename);
    const canonicalSlug = getSlugFromMdFile(dirPath, filename);
    if (existingIds.has(canonicalSlug) || existingIds.has(fileId)) continue;
    const entry = idToEntry.get(canonicalSlug) || idToEntry.get(canonicalSlug.toLowerCase()) || idToEntry.get(fileId) || idToEntry.get(fileId.toLowerCase());
    if (entry) {
      existingIds.add(canonicalSlug);
      existingIds.add(fileId);
      continue;
    }
    maxSort += SORT_STEP;
    added.push({ id: canonicalSlug, active: true, sort: maxSort });
    idToEntry.set(canonicalSlug, { id: canonicalSlug, active: true, sort: maxSort });
    existingIds.add(canonicalSlug);
    existingIds.add(fileId);
  }

  if (added.length) {
    const merged = items
      .filter((e) => e.id != null)
      .map((e) => ({
        id: e.id,
        active: e.active !== false,
        sort: typeof e.sort === 'number' ? e.sort : 999,
        ...(typeof e.pathId === 'number' && { pathId: e.pathId }),
      }));
    for (const a of added) merged.push(a);
    merged.sort((a, b) => (a.sort || 999) - (b.sort || 999));
    writeArticlesJson(dirPath, merged);
    items = merged;
  }

  // Không cần ghi frontmatter nữa - sidebar được generate trực tiếp từ _articles.json
  console.log('[apply-articles-json]', path.relative(ROOT, dirPath), '→', items.length, 'articles in JSON');
}

function ensureArticlesJson(dirPath) {
  const mdFiles = getMdFiles(dirPath);
  if (mdFiles.length === 0) return;
  if (readArticlesJson(dirPath)) return;
  const items = mdFiles.map((name, i) => ({
    id: getIdFromFilename(name),
    active: true,
    sort: (i + 1) * SORT_STEP,
  }));
  writeArticlesJson(dirPath, items);
}

function walkDocs(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const hasMd = entries.some(
    (e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')) && !e.name.startsWith('_')
  );
  if (hasMd) {
    applyArticlesToFolder(dirPath);
  }
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith('.')) walkDocs(path.join(dirPath, e.name));
  }
}

if (!fs.existsSync(DOCS)) {
  console.log('[apply-articles-json] No docs/, skip.');
  process.exit(0);
}

walkDocs(DOCS);
