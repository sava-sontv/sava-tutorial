/**
 * Tự sinh _category_.json (chỉ schema Docusaurus), _category.json (active/sort/id) và categories.generated.ts.
 * Cấu trúc: categories (path /categories/{id}-{slug}) → sections (path /sections/{id}-{slug}) → articles (path /articles/{pathId}-{slug}).
 * Sửa active/sort/id trong _category.json và pathId trong _articles.json rồi chạy yarn ensure-category-json.
 *
 * Chuyển bài viết / section sang category hoặc section khác:
 * - Path (/articles/id-slug, /sections/id-slug) không phụ thuộc vị trí thư mục; pathId/id lấy từ slug hoặc _articles.json/_category.json.
 * - Sau khi di chuyển file trong docs/, chạy lại yarn ensure-category-json (và yarn generate-sidebar).
 * - pathToDocPath.json và docPathToPath.json được build lại theo cấu trúc docs/ hiện tại → redirect và link không lỗi.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const GENERATED_PATH = path.join(ROOT, 'src', 'data', 'categories.generated.ts');
const PATH_TO_DOC_PATH_JSON = path.join(ROOT, 'src', 'data', 'pathToDocPath.json');

const CATEGORY_JSON = '_category_.json'; // Docusaurus: label, position, link
const CATEGORY_META_JSON = '_category.json'; // meta: active, sort, id
const ARTICLES_FILE = '_articles.json'; // id (slug), pathId (number), active, sort
const I18N_VI_DOCS = path.join(ROOT, 'i18n', 'vi', 'docusaurus-plugin-content-docs', 'current');

/** Chuẩn hóa .md/.mdx: thay <http(s)://...> bằng [url](url) để MDX không parse nhầm thành JSX. */
function normalizeAngleBracketUrls(text) {
  return text.replace(/<(https?:\/\/[^>]+)>/g, (_, url) => `[${url}](${url})`);
}

/** Chuẩn hóa list: dòng bắt đầu bằng "* * " → "  * " để tránh render thừa 1 dấu tròn (nested list đúng thụt). */
function normalizeListBullet(text) {
  return text.replace(/^\* \* /gm, '  * ');
}

function processNormalizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let normalized = normalizeAngleBracketUrls(content);
  normalized = normalizeListBullet(normalized);
  if (normalized !== content) {
    fs.writeFileSync(filePath, normalized, 'utf8');
    return true;
  }
  return false;
}

function walkNormalizeDir(dirPath, onFile) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dirPath, e.name);
    if (e.isDirectory() && !e.name.startsWith('.')) {
      walkNormalizeDir(fullPath, onFile);
    } else if (e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx'))) {
      onFile(fullPath);
    }
  }
}

function runNormalizeDocsMdx() {
  let count = 0;
  walkNormalizeDir(DOCS, (filePath) => {
    if (processNormalizeFile(filePath)) {
      count++;
      console.log('[ensure-category-json] Normalized <url> → [url](url):', path.relative(ROOT, filePath));
    }
  });
  if (fs.existsSync(I18N_VI_DOCS)) {
    walkNormalizeDir(I18N_VI_DOCS, (filePath) => {
      if (processNormalizeFile(filePath)) {
        count++;
        console.log('[ensure-category-json] Normalized <url> → [url](url):', path.relative(ROOT, filePath));
      }
    });
  }
  if (count > 0) {
    console.log('[ensure-category-json] String normalize:', count, 'file(s).');
  }
}

/** Sinh id số ổn định từ slug (cùng slug → cùng id). */
function slugToId(slug) {
  if (!slug || typeof slug !== 'string') return 0;
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h) + slug.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function slugToTitle(slug) {
  if (!slug || typeof slug !== 'string') return slug;
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function hasMdFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return false;
  return fs.readdirSync(dirPath, { withFileTypes: true }).some(
    (e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')) && !e.name.startsWith('_')
  );
}

/** Category có docs nếu có .md trực tiếp HOẶC có subdir (topic) chứa .md (cấu trúc 3 cấp). */
function hasDocsInCategory(dirPath) {
  if (!fs.existsSync(dirPath)) return false;
  if (hasMdFiles(dirPath)) return true;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith('.')) {
      if (hasMdFiles(path.join(dirPath, e.name))) return true;
    }
  }
  return false;
}

function getTopLevelDirsWithDocs() {
  if (!fs.existsSync(DOCS)) return [];
  return fs
    .readdirSync(DOCS, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => hasDocsInCategory(path.join(DOCS, e.name)))
    .map((e) => e.name)
    .sort();
}

/** Lấy danh sách subdir (topic) trong category có chứa .md */
function getTopicSubdirs(catPath) {
  if (!fs.existsSync(catPath)) return [];
  return fs
    .readdirSync(catPath, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .filter((e) => hasMdFiles(path.join(catPath, e.name)))
    .map((e) => e.name)
    .sort();
}

/** Đọc active/sort/id từ _category.json; migrate từ _category_.meta.json hoặc _category_.json nếu cũ. */
function readMeta(dirPath, dirName, index) {
  const defaultId = slugToId(dirName);
  const defaultMeta = { active: true, sort: (index + 1) * 5, id: defaultId };
  const parseMeta = (data) => ({
    active: typeof data.active === 'boolean' ? data.active : true,
    sort: typeof data.sort === 'number' ? data.sort : defaultMeta.sort,
    id: typeof data.id === 'number' ? data.id : defaultId,
  });
  const metaPath = path.join(dirPath, CATEGORY_META_JSON);
  const oldMetaPath = path.join(dirPath, '_category_.meta.json');
  const docusaurusPath = path.join(dirPath, CATEGORY_JSON);
  if (fs.existsSync(metaPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      return parseMeta(data);
    } catch {
      return defaultMeta;
    }
  }
  for (const filePath of [oldMetaPath, docusaurusPath]) {
    if (!fs.existsSync(filePath)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const meta = parseMeta(data);
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
      console.log('[ensure-category-json] Wrote', path.relative(ROOT, metaPath), '(migrate)');
      if (filePath === oldMetaPath) try { fs.unlinkSync(oldMetaPath); } catch (_) {}
      return meta;
    } catch {
      continue;
    }
  }
  return defaultMeta;
}

/** Ghi _category_.json; dùng meta.sort làm position để thứ tự sidebar khớp với _category.json. */
function writeCategoryJson(dirPath, dirName, meta) {
  const title = slugToTitle(dirName);
  const filePath = path.join(dirPath, CATEGORY_JSON);
  let position = typeof meta?.sort === 'number' ? meta.sort : 1;
  if (fs.existsSync(filePath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (typeof existing.position === 'number' && existing.position !== 1) position = existing.position;
    } catch (_) {}
  }
  const payload = {
    label: title,
    position,
    link: {
      type: 'generated-index',
      title,
      slug: dirName,
      description: `Articles in ${title}`,
    },
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
  console.log('[ensure-category-json] Wrote', path.relative(ROOT, filePath));
}

function writeCategoryMeta(dirPath, meta) {
  const filePath = path.join(dirPath, CATEGORY_META_JSON);
  const newContent = JSON.stringify(meta, null, 2);
  if (fs.existsSync(filePath)) {
    try {
      const current = fs.readFileSync(filePath, 'utf8');
      if (current.trim() === newContent.trim()) return;
    } catch (_) {}
  }
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('[ensure-category-json] Wrote', path.relative(ROOT, filePath));
}

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

function readArticlesJson(dirPath) {
  const filePath = path.join(dirPath, ARTICLES_FILE);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Đọc description từ _category_.json (link.description). */
function readCategoryDescription(dirPath, fallback) {
  const filePath = path.join(dirPath, CATEGORY_JSON);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return data.link && typeof data.link.description === 'string' ? data.link.description : (fallback || '');
    } catch (_) {}
  }
  return fallback || '';
}

function getIdFromFilename(name) {
  return name.replace(/\.(md|mdx)$/i, '');
}

/** Đọc slug từ frontmatter của file .md/.mdx (nếu có); không có thì dùng tên file. Để docPath khớp route Docusaurus. */
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

/** Đảm bảo mỗi article có pathId (number); ghi lại _articles.json khi có thay đổi hoặc thiếu entry. */
function ensureArticlesPathId(topicPath, articleEntries) {
  let changed = false;
  const out = articleEntries.map((item) => {
    const slug = typeof item.id === 'string' ? item.id : (item.id || '').toString();
    const pathId = typeof item.pathId === 'number' ? item.pathId : slugToId(slug);
    if (item.pathId !== pathId) changed = true;
    return { ...item, id: slug, pathId, active: item.active !== false, sort: typeof item.sort === 'number' ? item.sort : 999 };
  });
  const filePath = path.join(topicPath, ARTICLES_FILE);
  const newContent = JSON.stringify(out, null, 2);
  const exists = fs.existsSync(filePath);
  if (!exists || fs.readFileSync(filePath, 'utf8') !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('[ensure-category-json] Wrote', path.relative(ROOT, filePath), changed ? '(pathId)' : '');
  }
  return out;
}

/** Merge: nguồn chân lý là file .md; metadata (pathId, active, sort) từ _articles.json nếu có. Mỗi slug chỉ 1 entry (dedupe theo slug). */
function mergeArticlesFromMdAndJson(sectionPath) {
  const mdFiles = getMdFiles(sectionPath);
  const articlesJson = readArticlesJson(sectionPath);
  const byId = new Map();
  for (const e of articlesJson) {
    if (e.id != null) byId.set(String(e.id), { ...e });
    if (e.id != null) byId.set(String(e.id).toLowerCase(), byId.get(String(e.id)) || { ...e });
  }
  const merged = mdFiles.map((f) => {
    const fileSlug = getIdFromFilename(f);
    const slug = getSlugFromMdFile(sectionPath, f);
    const existing = byId.get(slug) || byId.get(slug.toLowerCase()) || byId.get(fileSlug) || byId.get(fileSlug.toLowerCase());
    return existing ? { ...existing, id: slug } : { id: slug, active: true, sort: 999 };
  });
  const bySlug = new Map();
  for (const e of merged) {
    const s = String(e.id);
    if (bySlug.has(s)) {
      const prev = bySlug.get(s);
      bySlug.set(s, { ...prev, pathId: prev.pathId ?? e.pathId, sort: typeof prev.sort === 'number' ? prev.sort : e.sort });
    } else {
      bySlug.set(s, e);
    }
  }
  return ensureArticlesPathId(sectionPath, Array.from(bySlug.values()));
}

/** Build cây đầy đủ: categories → sections → articles với path /categories/id-slug, /sections/id-slug, /articles/pathId-slug. */
function buildCategoriesTree() {
  const dirNames = getTopLevelDirsWithDocs();
  const tree = [];
  for (let i = 0; i < dirNames.length; i++) {
    const catSlug = dirNames[i];
    const catPath = path.join(DOCS, catSlug);
    const catMeta = readMeta(catPath, catSlug, i);
    if (!catMeta.active) continue;
    const topicNames = getTopicSubdirs(catPath);
    const sections = [];
    for (let t = 0; t < topicNames.length; t++) {
      const sectionSlug = topicNames[t];
      const sectionPath = path.join(catPath, sectionSlug);
      const sectionMeta = readMeta(sectionPath, sectionSlug, t);
      if (!sectionMeta.active) continue;
      const articleEntries = mergeArticlesFromMdAndJson(sectionPath);
      const articles = [];
      for (const art of articleEntries) {
        if (art.active === false) continue;
        const slug = typeof art.id === 'string' ? art.id : String(art.id);
        const pathId = typeof art.pathId === 'number' ? art.pathId : slugToId(slug);
        const title = slugToTitle(slug);
        const desc = (art.description && typeof art.description === 'string') ? art.description : `Article: ${title}`;
        articles.push({
          title: slug,
          description: desc,
          path: `/articles/${pathId}-${slug}`,
          docPath: `/docs/${catSlug}/${sectionSlug}/${slug}`,
          active: art.active !== false,
          sort: typeof art.sort === 'number' ? art.sort : 999,
        });
      }
      articles.sort((a, b) => a.sort - b.sort);
      const sectionTitle = slugToTitle(sectionSlug);
      const sectionDesc = readCategoryDescription(sectionPath, `Articles in ${sectionTitle}`);
      sections.push({
        title: sectionSlug,
        description: sectionDesc,
        path: `/sections/${sectionMeta.id}-${sectionSlug}`,
        docPath: `/docs/${catSlug}/${sectionSlug}`,
        active: sectionMeta.active,
        sort: sectionMeta.sort,
        articles,
      });
    }
    sections.sort((a, b) => a.sort - b.sort);
    const catTitle = slugToTitle(catSlug);
    const catDesc = readCategoryDescription(catPath, `Articles in ${catTitle}`);
    tree.push({
      title: catSlug,
      description: catDesc,
      path: `/categories/${catMeta.id}-${catSlug}`,
      docPath: `/docs/${catSlug}`,
      active: catMeta.active,
      sort: catMeta.sort,
      sections,
    });
  }
  tree.sort((a, b) => a.sort - b.sort);
  return tree;
}

function escapeTs(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function generateCategoriesTs(tree) {
  const lines = [
    '/** Auto-generated từ docs/ và _category.json. Cấu trúc: categories → sections → articles. Path: /categories/id-slug, /sections/id-slug, /articles/pathId-slug. */',
    '',
    'export type ArticleItem = {',
    '  title: string;',
    '  description: string;',
    '  path: string;',
    '  docPath: string;',
    '  active: boolean;',
    '  sort: number;',
    '};',
    '',
    'export type SectionItem = {',
    '  title: string;',
    '  description: string;',
    '  path: string;',
    '  docPath: string;',
    '  active: boolean;',
    '  sort: number;',
    '  articles: ArticleItem[];',
    '};',
    '',
    'export type CategoryItem = {',
    '  title: string;',
    '  description: string;',
    '  path: string;',
    '  docPath: string;',
    '  active: boolean;',
    '  sort: number;',
    '  sections: SectionItem[];',
    '};',
    '',
    'export const categories: CategoryItem[] = [',
  ];
  for (const cat of tree) {
    const titleEsc = escapeTs(cat.title);
    const descEsc = escapeTs(cat.description);
    lines.push(`  { title: '${titleEsc}', description: '${descEsc}', path: '${cat.path}', docPath: '${cat.docPath}', active: ${cat.active}, sort: ${cat.sort}, sections: [`);
    for (const sec of cat.sections) {
      const stEsc = escapeTs(sec.title);
      const sdEsc = escapeTs(sec.description);
      lines.push(`    { title: '${stEsc}', description: '${sdEsc}', path: '${sec.path}', docPath: '${sec.docPath}', active: ${sec.active}, sort: ${sec.sort}, articles: [`);
      for (const art of sec?.articles) {
        const atEsc = escapeTs(art.title);
        const adEsc = escapeTs(art.description);
        lines.push(`      { title: '${atEsc}', description: '${adEsc}', path: '${art.path}', docPath: '${art.docPath}', active: ${art.active}, sort: ${art.sort} },`);
      }
      lines.push('    ] },');
    }
    lines.push('  ] },');
  }
  lines.push('];');
  lines.push('');
  fs.mkdirSync(path.dirname(GENERATED_PATH), { recursive: true });
  fs.writeFileSync(GENERATED_PATH, lines.join('\n'), 'utf8');
  console.log('[ensure-category-json] Wrote', path.relative(ROOT, GENERATED_PATH));
}

const DOC_PATH_TO_PATH_JSON = path.join(ROOT, 'src', 'data', 'docPathToPath.json');
const ARTICLE_ID_TO_DOC_PATH_JSON = path.join(ROOT, 'src', 'data', 'articleIdToDocPath.json');
const SECTION_ID_TO_PATH_JSON = path.join(ROOT, 'src', 'data', 'sectionIdToPath.json');
const CATEGORY_ID_TO_PATH_JSON = path.join(ROOT, 'src', 'data', 'categoryIdToPath.json');

/** Ghi pathToDocPath (chỉ categories + sections), docPathToPath, articleIdToDocPath, sectionIdToPath, categoryIdToPath (id -> { path, docPath }). */
function writePathToDocPathJson(tree) {
  const pathToDocPath = {};
  const docPathToPath = {};
  const articleIdToDocPath = {};
  const sectionIdToPath = {};
  const categoryIdToPath = {};
  for (const cat of tree) {
    pathToDocPath[cat.path] = cat.docPath;
    docPathToPath[cat.docPath] = cat.path;
    const categoryId = cat.path.replace(/^\/categories\/(\d+)-.+$/, '$1');
    if (categoryId && categoryId !== cat.path) {
      categoryIdToPath[categoryId] = { path: cat.path, docPath: cat.docPath };
    }
    for (const sec of cat.sections) {
      pathToDocPath[sec.path] = sec.docPath;
      docPathToPath[sec.docPath] = sec.path;
      const sectionId = sec.path.replace(/^\/sections\/(\d+)-.+$/, '$1');
      if (sectionId && sectionId !== sec.path) {
        sectionIdToPath[sectionId] = { path: sec.path, docPath: sec.docPath };
      }
      for (const art of sec.articles) {
        docPathToPath[art.docPath] = art.path;
        const pathId = art.path.replace(/^\/articles\/(\d+)-.+$/, '$1');
        if (pathId && pathId !== art.path) {
          articleIdToDocPath[pathId] = { docPath: art.docPath, path: art.path };
        }
      }
    }
  }
  fs.writeFileSync(PATH_TO_DOC_PATH_JSON, JSON.stringify(pathToDocPath, null, 2), 'utf8');
  fs.writeFileSync(DOC_PATH_TO_PATH_JSON, JSON.stringify(docPathToPath, null, 2), 'utf8');
  fs.writeFileSync(ARTICLE_ID_TO_DOC_PATH_JSON, JSON.stringify(articleIdToDocPath, null, 2), 'utf8');
  fs.writeFileSync(SECTION_ID_TO_PATH_JSON, JSON.stringify(sectionIdToPath, null, 2), 'utf8');
  fs.writeFileSync(CATEGORY_ID_TO_PATH_JSON, JSON.stringify(categoryIdToPath, null, 2), 'utf8');
  console.log('[ensure-category-json] Wrote', path.relative(ROOT, PATH_TO_DOC_PATH_JSON), ',', path.relative(ROOT, DOC_PATH_TO_PATH_JSON), ',', path.relative(ROOT, ARTICLE_ID_TO_DOC_PATH_JSON), ',', path.relative(ROOT, SECTION_ID_TO_PATH_JSON), ',', path.relative(ROOT, CATEGORY_ID_TO_PATH_JSON));
}

if (!fs.existsSync(DOCS)) {
  console.log('[ensure-category-json] No docs/ folder, skip.');
  process.exit(0);
}

runNormalizeDocsMdx();

const dirNames = getTopLevelDirsWithDocs();

// 1. Category (folder cấp 1): đảm bảo _category.json có id, _category_.json tồn tại
for (let i = 0; i < dirNames.length; i++) {
  const dirName = dirNames[i];
  const dirPath = path.join(DOCS, dirName);
  const metaPath = path.join(dirPath, CATEGORY_META_JSON);
  const categoryJsonPath = path.join(dirPath, CATEGORY_JSON);
  const meta = readMeta(dirPath, dirName, i);
  writeCategoryMeta(dirPath, meta);
  if (!fs.existsSync(categoryJsonPath)) {
    writeCategoryJson(dirPath, dirName, meta);
  }
}

// 2. Section (topic, subdir có .md): đảm bảo _category.json có id, _category_.json tồn tại
for (const dirName of dirNames) {
  const catPath = path.join(DOCS, dirName);
  const topicNames = getTopicSubdirs(catPath);
  topicNames.forEach((topicName, idx) => {
    const topicPath = path.join(catPath, topicName);
    const meta = readMeta(topicPath, topicName, idx);
    writeCategoryMeta(topicPath, meta);
    const categoryJsonPath = path.join(topicPath, CATEGORY_JSON);
    if (!fs.existsSync(categoryJsonPath)) {
      writeCategoryJson(topicPath, topicName, meta);
    }
  });
}

// 3. Build cây categories → sections → articles (đảm bảo pathId trong _articles.json) và sinh categories.generated.ts + pathToDocPath.json
const tree = buildCategoriesTree();
generateCategoriesTs(tree);
writePathToDocPathJson(tree);
