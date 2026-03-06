"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const axios_1 = __importDefault(require("axios"));
// Import auth service for dynamic token (local version)
const { authService } = require('./auth-service.js');
const EXCLUDE_METADATA_KEYS = new Set([
    'id', 'createdAt', 'updatedAt', 'publishedAt', 'locale',
    'documentId', // From previous logs, this also appears to be a metadata/identifier field
    'uid', // Also exclude the UID field from content consideration
    // Add other common Strapi metadata fields as needed
]);
const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://help.savameta.local:1337';
// Global variable to store JWT token
let STRAPI_JWT_TOKEN = '';
const CONTENT_FIELD_PRIORITY = {
    'default': ['content', 'description', 'body', 'text'],
};
const TITLE_FIELD_PRIORITY = {
    'default': ['title', 'name', 'heading', 'label'],
    // 'posts': ['postTitle', 'heading'],
};
const SLUG_FIELD_PRIORITY = {
    'default': ['slug', 'name', 'title'],
    // 'posts': ['postSlug', 'title'],
};
const AUTHOR_FIELD_PRIORITY = {
    'default': ['author'], // 'createdBy.username' needs special handling, not just a field name
    // 'posts': ['authorName', 'editor'],
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Get authentication token for Strapi API
 * Priority:
 * 1. Use STRAPI_API_TOKEN if available (full access, no expiration)
 * 2. Otherwise, authenticate with user credentials to get JWT token
 */
async function getAuthToken() {
    // Option 1: Use API Token if available
    const apiToken = process.env.STRAPI_API_TOKEN;
    if (apiToken && apiToken.trim() !== '') {
        STRAPI_JWT_TOKEN = apiToken;
        return apiToken;
    }
    // Option 2: Authenticate with user credentials to get JWT token
    // try {
    //   console.log('🔐 No API Token found. Authenticating with user credentials...');
    //   const email = process.env.STRAPI_USER_EMAIL;
    //   const password = process.env.STRAPI_USER_PASSWORD;
    //   let result;
    //
    //   try {
    //     result = await authService.login(email, password);
    //     console.log('✅ Login successful');
    //   } catch (loginError: any) {
    //     console.log('⚠️  Login failed, attempting to register new user...', loginError);
    //   }
    //
    //   STRAPI_JWT_TOKEN = result.jwt;
    //   return STRAPI_JWT_TOKEN;
    // } catch (error: any) {
    //   console.error('❌ Failed to get authentication token:', error.message);
    //   throw error;
    // }
}
// Auto-detect populate fields for content types
async function detectPopulateFields(apiName) {
    var _a;
    try {
        const url = `${STRAPI_BASE_URL}/api/${apiName}?populate=*`;
        const headers = {};
        if (STRAPI_JWT_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_JWT_TOKEN}`;
        }
        const response = await axios_1.default.get(url, { headers });
        const items = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
        if (items && (items === null || items === void 0 ? void 0 : items.length) > 0) {
            const uniqueMediaFields = new Set();
            for (const item of items) {
                for (const [fieldName, value] of Object.entries(item)) {
                    if (isMediaField(value)) {
                        uniqueMediaFields.add(fieldName);
                    }
                }
            }
            if (uniqueMediaFields.size > 0) {
                return Array.from(uniqueMediaFields).join(',');
            }
        }
    }
    catch (error) {
        console.log('error', error.message);
    }
    return '';
}
// Helper function để detect media field
function isMediaField(value) {
    if (!value)
        return false;
    if (typeof value === 'object' && !Array.isArray(value) && value.mime && value.url) {
        return true;
    }
    if (Array.isArray(value) && value.length > 0) {
        return value.some((item) => typeof item === 'object' && item.mime && item.url);
    }
    return false;
}
function normalizeNewlinesForMarkdown(s) {
    return s.replace(/\n/g, '  \n');
}
const FORMAT_MAX_INLINE_DEPTH = 50;
const FORMAT_MAX_LIST_DEPTH = 20;
const LIST_BLOCK_TYPES = new Set(['list', 'ordered-list', 'list-ordered', 'listOrdered']);
const LIST_ITEM_TYPES = new Set(['list-item', 'listItem']);
function isListBlock(block) {
    var _a;
    const t = ((_a = block === null || block === void 0 ? void 0 : block.type) !== null && _a !== void 0 ? _a : '');
    return LIST_BLOCK_TYPES.has(t);
}
function isListItemBlock(block) {
    var _a;
    const t = (_a = block === null || block === void 0 ? void 0 : block.type) !== null && _a !== void 0 ? _a : '';
    return LIST_ITEM_TYPES.has(t);
}
/**
 * Hàm format riêng cho content Strapi (Rich Text).
 * - Number list đủ các cấp: 1., 1. 2., 1. 2. 3., ...
 */
function formatStrapiContent(content) {
    const seenInline = new WeakSet();
    const seenLists = new WeakSet();
    function formatChildren(children, depth = 0) {
        if (depth > FORMAT_MAX_INLINE_DEPTH || !children)
            return '';
        return children.map(child => {
            if (typeof child === 'object' && child !== null && seenInline.has(child))
                return '';
            if (typeof child === 'object' && child !== null)
                seenInline.add(child);
            if ('text' in child)
                return child.text || '';
            if ('type' in child)
                return formatChildren(child.children, depth + 1);
            return '';
        }).join('') || '';
    }
    /** Chuyển số La Mã (i, ii, iii) thành số (1, 2, 3) */
    function romanToNumber(roman) {
        var _a;
        const map = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };
        const s = roman.toLowerCase().replace(/\s/g, '');
        let n = 0, prev = 0;
        for (let k = s.length - 1; k >= 0; k--) {
            const v = (_a = map[s[k]]) !== null && _a !== void 0 ? _a : 0;
            n += v < prev ? -v : v;
            prev = v;
        }
        return n;
    }
    function renderList(listBlock, prefix = []) {
        var _a, _b, _c, _d, _e;
        if (prefix.length > FORMAT_MAX_LIST_DEPTH)
            return '';
        if (typeof listBlock === 'object' && listBlock !== null && seenLists.has(listBlock))
            return '';
        if (typeof listBlock === 'object' && listBlock !== null)
            seenLists.add(listBlock);
        const formatVal = listBlock.format;
        const isOrdered = formatVal === 'ordered' ||
            listBlock.listType === 'ordered' ||
            /ordered|number/i.test(String((_a = listBlock.type) !== null && _a !== void 0 ? _a : ''));
        const rawChildren = (_b = listBlock === null || listBlock === void 0 ? void 0 : listBlock.children) !== null && _b !== void 0 ? _b : [];
        const items = rawChildren.filter(isListItemBlock);
        const lines = [];
        // Cấp thụt (indentLevel) nếu Strapi trả về list phẳng
        const hasIndentLevel = items.some((it) => typeof it.indentLevel === 'number');
        if (hasIndentLevel && isOrdered) {
            const levelCounts = [];
            for (let i = 0; i < items.length; i++) {
                const listItemBlock = items[i];
                const indent = Math.max(0, (_c = listItemBlock.indentLevel) !== null && _c !== void 0 ? _c : 0);
                while (levelCounts.length > indent + 1)
                    levelCounts.pop();
                if (levelCounts.length <= indent)
                    levelCounts.push(1);
                else
                    levelCounts[indent] = ((_d = levelCounts[indent]) !== null && _d !== void 0 ? _d : 0) + 1;
                const currentPrefix = levelCounts.slice(0, indent + 1);
                const numberLabel = currentPrefix.join('. ') + '. ';
                const lineContent = formatChildren(listItemBlock.children, 0);
                lines.push(numberLabel + lineContent);
            }
            return lines.join('\n');
        }
        for (let i = 0; i < items.length; i++) {
            const listItemBlock = items[i];
            const currentPrefix = [...prefix, i + 1];
            const numberLabel = currentPrefix.join('. ') + '. ';
            const bullet = isOrdered ? numberLabel : '- ';
            // Luôn lấy toàn bộ text từ children (paragraph/text bất kỳ độ sâu)
            let lineContent = formatChildren(listItemBlock.children, 0);
            const nestedParts = [];
            for (const child of (_e = listItemBlock.children) !== null && _e !== void 0 ? _e : []) {
                if (!('type' in child))
                    continue;
                const subBlock = child;
                if (isListBlock(subBlock)) {
                    nestedParts.push(renderList(subBlock, currentPrefix));
                }
            }
            // Chuẩn hóa số La Mã trong nội dung: "ii. Nội dung 2" → "1. 2. Nội dung 2" (top-level item thứ 2)
            if (isOrdered && nestedParts.length === 0) {
                const romanMatch = lineContent.match(/^\s*([ivxlcdm]+)\.\s+(.*)/i);
                if (romanMatch) {
                    const num = romanToNumber(romanMatch[1]);
                    if (num >= 1 && num <= 20) {
                        const rest = romanMatch[2];
                        if (prefix.length >= 1) {
                            lines.push([...prefix, num].join('. ') + '. ' + rest);
                            continue;
                        }
                        if (i >= 1) {
                            lines.push('1. ' + num + '. ' + rest);
                            continue;
                        }
                    }
                }
            }
            lines.push(bullet + lineContent);
            if (nestedParts.length)
                lines.push(nestedParts.join('\n'));
        }
        return lines.join('\n');
    }
    return content.map(block => {
        var _a, _b;
        const blockType = ((_a = block === null || block === void 0 ? void 0 : block.type) !== null && _a !== void 0 ? _a : '');
        if (blockType === 'paragraph') {
            return formatChildren(block.children, 0);
        }
        if (blockType === 'heading') {
            const level = (_b = block.level) !== null && _b !== void 0 ? _b : 1;
            return '#'.repeat(Number(level)) + ' ' + formatChildren(block.children, 0);
        }
        if (isListBlock(block)) {
            return renderList(block);
        }
        return '';
    }).filter(Boolean).join('\n\n');
}
const DEBUG_STRAPI_CONTENT = process.env.DEBUG_STRAPI_CONTENT === '1' || process.env.DEBUG_STRAPI_CONTENT === 'true';
let debugContentWritten = false;
function processContentAuto(item, apiName) {
    if (item.content && Array.isArray(item.content) && item.content.length > 0) {
        if (DEBUG_STRAPI_CONTENT && !debugContentWritten) {
            try {
                // Script chạy từ dist/scripts/ → project root = __dirname/../..
                const projectRoot = path_1.default.resolve(__dirname, '..', '..');
                const debugPath = path_1.default.join(projectRoot, 'strapi-content-debug.json');
                fs_1.default.writeFileSync(debugPath, JSON.stringify(item.content, null, 2), 'utf8');
                console.log('📄 Debug: đã ghi cấu trúc content vào', debugPath);
                debugContentWritten = true;
            }
            catch (e) {
                console.error('📄 Debug: không ghi được file:', e.message);
            }
        }
        return formatStrapiContent(item.content);
    }
    const prioritizedFields = CONTENT_FIELD_PRIORITY[apiName] || CONTENT_FIELD_PRIORITY['default'];
    for (const fieldName of prioritizedFields) {
        for (const key in item) {
            if (typeof item[key] === 'string' && key.toLowerCase() === fieldName.toLowerCase()) {
                return normalizeNewlinesForMarkdown(item[key]);
            }
        }
    }
    // 3. Heuristic: Find the longest string field that is not metadata
    let longestContent = '';
    for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && typeof item[key] === 'string') {
            if (!EXCLUDE_METADATA_KEYS.has(key) &&
                item[key].length > longestContent.length &&
                item[key].length > 50) {
                longestContent = item[key];
            }
        }
    }
    if (longestContent) {
        return normalizeNewlinesForMarkdown(longestContent);
    }
    return '';
}
function processThumbnailsAuto(item, baseUrl) {
    const thumbnailFields = ['thumbnails', 'images', 'image', 'thumbnail', 'cover', 'photo', 'photos', 'media'];
    for (const field of thumbnailFields) {
        const fieldContent = item[field];
        if (fieldContent) {
            const images = Array.isArray(fieldContent) ? fieldContent : [fieldContent];
            return images
                .filter(img => img && img.url)
                .map(img => ({
                url: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`,
                width: img.width || null,
                height: img.height || null,
            }));
        }
    }
    return [];
}
function findFieldInItem(item, apiName, priorityMap, defaultValue = '') {
    const prioritizedFields = priorityMap[apiName] || priorityMap['default'];
    for (const fieldName of prioritizedFields) {
        for (const key in item) {
            if (typeof item[key] === 'string' && key.toLowerCase() === fieldName.toLowerCase()) {
                if (item[key]) { // Ensure the value is not empty
                    return item[key];
                }
            }
        }
    }
    return defaultValue;
}
function generateFrontMatterAuto(item, thumbnails, apiName, singularName) {
    var _a;
    // Auto-detect slug field
    const slug = findFieldInItem(item, apiName, SLUG_FIELD_PRIORITY, '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `item-${item.id}`;
    // Auto-detect title field
    const title = findFieldInItem(item, apiName, TITLE_FIELD_PRIORITY, 'Untitled');
    // Auto-detect author field
    let author = findFieldInItem(item, apiName, AUTHOR_FIELD_PRIORITY);
    if (!author && ((_a = item.createdBy) === null || _a === void 0 ? void 0 : _a.username)) {
        author = item.createdBy.username;
    }
    const breadcrumb = [singularName, title];
    let frontMatter = `---\nsingularName: ${singularName}\nslug: ${slug}\ntitle: "${title.replace(/"/g, '\\"')}"\nbreadcrumb: [${breadcrumb.map(b => `"${String(b).replace(/"/g, '\\"')}"`).join(', ')}]`;
    if (author) {
        frontMatter += `\nauthor: ${author}`;
    }
    // Add thumbnails
    if (thumbnails.length > 0) {
        if (thumbnails.length > 1) {
            const thumbnailsYaml = thumbnails.map(thumb => {
                let item = `  - url: "${thumb.url}"`;
                if (thumb.width)
                    item += `\n    width: ${thumb.width}`;
                if (thumb.height)
                    item += `\n    height: ${thumb.height}`;
                return item;
            }).join('\n');
            frontMatter += `\nthumbnails:\n${thumbnailsYaml}`;
        }
        else {
            const thumb = thumbnails[0];
            frontMatter += `\nthumbnail: "${thumb.url}"`;
            if (thumb.width)
                frontMatter += `\nthumbnailWidth: ${thumb.width}`;
            if (thumb.height)
                frontMatter += `\nthumbnailHeight: ${thumb.height}`;
        }
        frontMatter += `\nthumbnailPosition: "bottom"`;
    }
    frontMatter += `\n---\n`;
    return frontMatter;
}
// Process other content types (auto-discovered)
async function processOtherContentType(apiName, singularName, populate, outputDir) {
    const apiUrl = `${STRAPI_BASE_URL}/api/${apiName}${populate ? `?populate=${populate}` : ''}`;
    try {
        const headers = {};
        if (STRAPI_JWT_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_JWT_TOKEN}`;
        }
        const response = await axios_1.default.get(apiUrl, { headers });
        const items = response.data.data || [];
        console.log(`📦 Received ${items.length} items for content type: ${apiName}`);
        if (!items || items.length === 0) {
            return 0;
        }
        let processedCount = 0;
        items.forEach((item) => {
            var _a, _b;
            const slug = item.slug ||
                ((_a = item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) ||
                ((_b = item.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) ||
                `item-${item.id}`;
            if (!slug || slug === 'item-undefined') {
                console.warn(`⚠️ Skipping item with undefined or empty slug (ID: ${item.id}).`);
                return;
            }
            const markdownContent = processContentAuto(item, apiName);
            const thumbnails = processThumbnailsAuto(item, STRAPI_BASE_URL);
            const frontMatter = generateFrontMatterAuto(item, thumbnails, apiName, singularName);
            const finalContent = `${frontMatter}\n${markdownContent}`;
            const subDirPath = path_1.default.join(outputDir, apiName);
            if (!fs_1.default.existsSync(subDirPath)) {
                fs_1.default.mkdirSync(subDirPath, { recursive: true });
            }
            const filePath = path_1.default.join(subDirPath, `${slug}.md`);
            console.log(`  Writing file to: ${filePath}`);
            fs_1.default.writeFileSync(filePath, finalContent);
            processedCount++;
        });
        return processedCount;
    }
    catch (error) {
        console.error(`⚠️ Failed to process ${apiName}:`, error.message);
        return 0;
    }
}
// Auto-discover ALL content types from Strapi
async function discoverAllContentTypes() {
    var _a;
    const discoveredTypes = [];
    const headers = {};
    if (STRAPI_JWT_TOKEN) {
        headers['Authorization'] = `Bearer ${STRAPI_JWT_TOKEN}`;
    }
    else {
        console.error('❌ JWT Token not available. Authentication may have failed.');
        process.exit(1);
    }
    try {
        const contentTypeUrl = `${STRAPI_BASE_URL}/api/content-type-builder/content-types`;
        const response = await axios_1.default.get(contentTypeUrl, { headers });
        const data = ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
        if (data && Array.isArray(data)) {
            data.forEach(ct => {
                if (ct.schema.draftAndPublish) {
                    const uid = ct === null || ct === void 0 ? void 0 : ct.uid;
                    const schema = (ct === null || ct === void 0 ? void 0 : ct.schema) || {};
                    const apiName = schema === null || schema === void 0 ? void 0 : schema.pluralName;
                    const singularName = schema === null || schema === void 0 ? void 0 : schema.singularName;
                    const displayName = schema === null || schema === void 0 ? void 0 : schema.displayName;
                    if (apiName && singularName && displayName) {
                        discoveredTypes.push({
                            uid: uid,
                            apiName: apiName,
                            singularName: singularName,
                            displayName: displayName,
                            apiID: ct.apiID,
                        });
                    }
                }
            });
        }
    }
    catch (error) {
        console.log(`⚠️ Primary content-type discovery failed: ${error.message}`);
    }
    return discoveredTypes;
}
function writeSidebarsAndNavbar(docusaurusRoot, useIntro, allContentTypes) {
    let generatedSidebars;
    let generatedNavbarItems;
    if (allContentTypes.length === 0) {
        generatedSidebars = { docsSidebar: [{ type: 'doc', id: 'intro' }] };
        generatedNavbarItems = [{ type: 'doc', docId: 'intro', position: 'left', label: 'Docs' }];
    }
    else {
        const firstCt = allContentTypes[0];
        generatedSidebars = allContentTypes.reduce((acc, ct) => {
            const items = useIntro && ct.apiName === firstCt.apiName
                ? [{ type: 'doc', id: 'intro' }, { type: 'autogenerated', dirName: ct.apiName }]
                : [{ type: 'autogenerated', dirName: ct.apiName }];
            acc[`${ct.singularName}Sidebar`] = items;
            return acc;
        }, {});
        generatedNavbarItems = allContentTypes.map((ct) => ({
            type: 'docSidebar',
            sidebarId: `${ct.singularName}Sidebar`,
            position: 'left',
            label: ct.singularName.charAt(0).toUpperCase() + ct.singularName.slice(1),
        }));
    }
    const sidebarsContent = `// This file is autogenerated by fetch-tutorials.ts. Do not edit it directly.
      /** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
      const sidebars = ${JSON.stringify(generatedSidebars, null, 2)};
      module.exports = sidebars;`;
    fs_1.default.writeFileSync(path_1.default.join(docusaurusRoot, 'sidebars.autogenerated.js'), sidebarsContent);
    console.log('✅ Generated sidebars.autogenerated.js');
    const navbarContent = `// This file is autogenerated by fetch-tutorials.ts. Do not edit it directly.
      /** @type {import('@docusaurus/preset-classic').ThemeConfig['navbar']['items']} */
      const navbarItems = ${JSON.stringify(generatedNavbarItems, null, 2)};
      module.exports = navbarItems;`;
    fs_1.default.writeFileSync(path_1.default.join(docusaurusRoot, 'navbar.autogenerated.js'), navbarContent);
    console.log('✅ Generated navbar.autogenerated.js');
}
async function fetchFromStrapiAndGenerateFiles() {
    const DOCUSAURUS_ROOT = path_1.default.join(__dirname, '..', '..');
    const DOCS_DIR = path_1.default.join(DOCUSAURUS_ROOT, 'docs');
    if (fs_1.default.existsSync(DOCS_DIR)) {
        fs_1.default.rmSync(DOCS_DIR, { recursive: true, force: true });
    }
    fs_1.default.mkdirSync(DOCS_DIR, { recursive: true });
    if (DEBUG_STRAPI_CONTENT) {
        console.log('📄 Debug mode: ON — sẽ ghi strapi-content-debug.json khi có content');
    }
    console.log('Ensuring Strapi is fully started...');
    await delay(15000); // Wait for Strapi to fully start
    try {
        await getAuthToken();
    }
    catch (authError) {
        console.error('❌ Authentication failed. Cannot proceed without token.');
        process.exit(1);
    }
    console.log('\n🔍 Auto-discovering ALL content types from Strapi...\n');
    // Discover all content types
    const allContentTypes = await discoverAllContentTypes();
    if (allContentTypes.length === 0) {
        console.log('No content types discovered. Creating intro.md and intro-only sidebar.');
        const introContent = `---
        title: "Welcome"
        ---
        
        # Welcome to Sava Meta Documentation
        
        Currently, there are no content types in Strapi. Publish content and run \`yarn fetch-content\` again.`;
        fs_1.default.writeFileSync(path_1.default.join(DOCS_DIR, 'intro.md'), introContent);
        writeSidebarsAndNavbar(DOCUSAURUS_ROOT, true, []);
        console.log('Exiting (no content types to process). Docusaurus can start with intro doc.');
        return;
    }
    console.log(`📦 Found ${allContentTypes.length} content type(s): ${allContentTypes.map(t => t.apiName).join(', ')}\n`);
    // Process each content type
    for (const contentType of allContentTypes) {
        const { apiName, displayName, singularName } = contentType;
        console.log(`📄 Processing ${displayName} (${apiName})...`);
        try {
            const populate = await detectPopulateFields(apiName);
            const processedCount = await processOtherContentType(apiName, singularName, populate, DOCS_DIR);
            if (processedCount > 0) {
                console.log(`✅ Completed: ${processedCount} item(s) processed`);
            }
            else {
                console.log(`⚠️ No items found or processed`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to process ${apiName}:`, error.message);
        }
    }
    console.log('🎉 All content types processed successfully!');
    const hasDocsFiles = fs_1.default.readdirSync(DOCS_DIR, { recursive: true })
        .some((file) => typeof file === 'string' && file.endsWith('.md'));
    if (!hasDocsFiles) {
        console.log('\n⚠️  No docs generated. Creating intro.md and sidebar with intro.');
        const introContent = `---
      title: "Welcome"
      --- 
      # Welcome to Sava Meta Documentation
      
      Welcome! This documentation is automatically generated from Sava Docs CMS.
      
      ## No Content Available
      
      Currently, there are no published items in Documents`;
        fs_1.default.writeFileSync(path_1.default.join(DOCS_DIR, 'intro.md'), introContent);
        writeSidebarsAndNavbar(DOCUSAURUS_ROOT, true, allContentTypes);
    }
    else {
        const introPath = path_1.default.join(DOCS_DIR, 'intro.md');
        if (fs_1.default.existsSync(introPath)) {
            fs_1.default.unlinkSync(introPath);
            console.log('Removed intro.md (docs already generated).');
        }
        writeSidebarsAndNavbar(DOCUSAURUS_ROOT, false, allContentTypes);
    }
}
fetchFromStrapiAndGenerateFiles();
