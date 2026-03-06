"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const axios_1 = __importDefault(require("axios"));
const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://127.0.0.1:1337';
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Auto-detect populate fields for content types
async function detectPopulateFields(apiName) {
    var _a;
    try {
        const url = `${STRAPI_BASE_URL}/api/${apiName}?populate=*`;
        const token = process.env.STRAPI_API_TOKEN || '';
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios_1.default.get(url, { headers });
        if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) {
            const mediaFieldNames = ['thumbnails', 'images', 'image', 'thumbnail', 'cover', 'photo',
                'photos', 'media', 'attachments', 'gallery'];
            for (const item of response.data.data) {
                const mediaFields = [];
                for (const field of mediaFieldNames) {
                    if (item[field] && (Array.isArray(item[field]) || item[field].url)) {
                        mediaFields.push(field);
                    }
                }
                if (mediaFields.length > 0) {
                    return mediaFields.join(',');
                }
            }
            return '';
        }
    }
    catch (error) {
        console.log('error', error.message);
    }
    return '';
}
function processContentAuto(item) {
    if (item.content && Array.isArray(item.content)) {
        return item.content.map(block => {
            var _a, _b, _c;
            if (block.type === 'paragraph') {
                return ((_a = block.children) === null || _a === void 0 ? void 0 : _a.map(child => child.text).join('')) || '';
            }
            else if (block.type === 'heading') {
                const level = block.level || 1;
                const heading = '#'.repeat(level);
                return `${heading} ${((_b = block.children) === null || _b === void 0 ? void 0 : _b.map(child => child.text).join('')) || ''}`;
            }
            else if (block.type === 'list') {
                return ((_c = block.children) === null || _c === void 0 ? void 0 : _c.map(listItem => {
                    const contentBlockItem = listItem; // Assume it's a block for list items
                    return `- ${(contentBlockItem.children || []).map(child => child.text).join('') || ''}`;
                }).join('\n')) || '';
            }
            return '';
        }).filter(Boolean).join('\n\n');
    }
    // Try text fields: content, description, body, text
    return item.description || item.body || item.text || '';
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
function generateFrontMatterAuto(item, thumbnails) {
    var _a, _b, _c;
    const slug = item.slug ||
        ((_a = item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) ||
        ((_b = item.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) ||
        `item-${item.id}`;
    // Auto-detect title field
    const title = item.title || item.name || item.heading || item.label || 'Untitled';
    // Auto-detect author field
    const author = item.author || ((_c = item.createdBy) === null || _c === void 0 ? void 0 : _c.username) || null;
    let frontMatter = `---\nslug: ${slug}\ntitle: "${title.replace(/"/g, '\\"')}"`;
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
async function processOtherContentType(apiName, populate, outputDir) {
    const apiUrl = `${STRAPI_BASE_URL}/api/${apiName}${populate ? `?populate=${populate}` : ''}`;
    try {
        const token = process.env.STRAPI_API_TOKEN || '';
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios_1.default.get(apiUrl, { headers });
        const items = response.data.data || [];
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
                return;
            }
            const markdownContent = processContentAuto(item);
            const thumbnails = processThumbnailsAuto(item, STRAPI_BASE_URL);
            const frontMatter = generateFrontMatterAuto(item, thumbnails); // STRAPI_BASE_URL is not used here
            const finalContent = `${frontMatter}\n${markdownContent}`;
            const subDirPath = path.join(outputDir, apiName);
            if (!fs.existsSync(subDirPath)) {
                fs.mkdirSync(subDirPath, { recursive: true });
            }
            const filePath = path.join(subDirPath, `${slug}.md`);
            fs.writeFileSync(filePath, finalContent);
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
    const discoveredTypes = [];
    const token = process.env.STRAPI_API_TOKEN || '';
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    else {
        console.error('❌ STRAPI_API_TOKEN environment variable not set. Exiting.');
        process.exit(1);
    }
    try {
        const contentTypeUrl = `${STRAPI_BASE_URL}/api/content-type-builder/content-types`;
        const response = await axios_1.default.get(contentTypeUrl, { headers });
        const data = response.data.data || [];
        if (data && Array.isArray(data)) {
            data.forEach(ct => {
                if (ct.schema.draftAndPublish) {
                    const schema = ct.schema || {};
                    const apiName = schema.pluralName;
                    const singularName = schema.singularName;
                    const displayName = schema.displayName;
                    if (apiName && singularName && displayName) { // Ensure all required fields are present
                        discoveredTypes.push({
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
async function fetchFromStrapiAndGenerateFiles() {
    const DOCUSAURUS_ROOT = path.join(__dirname, '..');
    const DOCS_DIR = path.join(DOCUSAURUS_ROOT, 'docs');
    if (fs.existsSync(DOCS_DIR)) {
        fs.readdirSync(DOCS_DIR).forEach(file => {
            const filePath = path.join(DOCS_DIR, file);
            if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        });
        console.log('Cleaned up old docs directory.');
    }
    else {
        fs.mkdirSync(DOCS_DIR, { recursive: true });
    }
    console.log('Ensuring Strapi is fully started...');
    await delay(15000); // Wait for Strapi to fully start
    console.log('\n🔍 Auto-discovering ALL content types from Strapi...\n');
    // Discover all content types
    const allContentTypes = await discoverAllContentTypes();
    if (allContentTypes.length === 0) {
        console.log('No content types discovered. Exiting.');
        return;
    }
    // --- Generate dynamic config files ---
    console.log('📝 Generating dynamic Docusaurus config files...');
    const generatedSidebars = allContentTypes.reduce((acc, ct) => {
        acc[`${ct.singularName}Sidebar`] = [{ type: 'autogenerated', dirName: ct.apiName }];
        return acc;
    }, {});
    const sidebarsContent = `// This file is autogenerated by fetch-tutorials.ts. Do not edit it directly.
      /** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
      const sidebars = ${JSON.stringify(generatedSidebars, null, 2)};
      module.exports = sidebars;`;
    fs.writeFileSync(path.join(DOCUSAURUS_ROOT, 'sidebars.autogenerated.js'), sidebarsContent);
    console.log('✅ Generated sidebars.autogenerated.js');
    const generatedNavbarItems = allContentTypes.map((ct) => ({
        type: 'docSidebar',
        sidebarId: `${ct.singularName}Sidebar`,
        position: 'left',
        label: ct.displayName,
    }));
    const navbarContent = `// This file is autogenerated by fetch-tutorials.ts. Do not edit it directly.
      /** @type {import('@docusaurus/preset-classic').ThemeConfig['navbar']['items']} */
      const navbarItems = ${JSON.stringify(generatedNavbarItems, null, 2)};
      module.exports = navbarItems;`;
    fs.writeFileSync(path.join(DOCUSAURUS_ROOT, 'navbar.autogenerated.js'), navbarContent);
    console.log('✅ Generated navbar.autogenerated.js');
    // --- End of generation ---
    console.log(`📦 Found ${allContentTypes.length} content type(s): ${allContentTypes.map(t => t.apiName).join(', ')}\n`);
    // Process each content type
    for (const contentType of allContentTypes) {
        const { apiName, displayName } = contentType;
        console.log(`📄 Processing ${displayName} (${apiName})...`);
        try {
            const populate = await detectPopulateFields(apiName);
            const processedCount = await processOtherContentType(apiName, populate, DOCS_DIR);
            if (processedCount > 0) {
                console.log(`  ✅ Completed: ${processedCount} item(s) processed`);
            }
            else {
                console.log(`  ⚠️  No items found or processed`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to process ${apiName}:`, error.message);
        }
    }
    console.log('🎉 All content types processed successfully!');
}
fetchFromStrapiAndGenerateFiles();
