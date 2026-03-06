# Cấu trúc route 3 cấp và categories – Thay đổi & Giải thích

Tài liệu này mô tả các thay đổi về route (`/categories/`, `/sections/`, `/articles/`), cấu trúc categories, và cách bài viết đi theo id (slug sai vẫn mở đúng bài).

---

## 1. Cấu trúc route 3 cấp (tham khảo Roblox)

URL không còn dạng `/docs/getting-started/...` mà theo path có **id** trong slug:

| Cấp | Path | Ví dụ |
|-----|------|--------|
| **Category** | `/categories/{id}-{slug}` | `/categories/1443555064-getting-started` |
| **Section** | `/sections/{id}-{slug}` | `/sections/1950491387-introduction-to-savrse` |
| **Article** | `/articles/{pathId}-{slug}` | `/articles/961964138-what-is-savrse` |

- **id** / **pathId**: số ổn định (lưu trong `_category.json` / `_articles.json`, hoặc sinh từ slug).
- **slug**: tên thư mục hoặc file (vd: `getting-started`, `what-is-savrse`).

Khi vào mỗi cấp (sidebar, breadcrumb, homepage), link đều dùng path tương ứng; URL trên thanh địa chỉ giữ đúng dạng trên.

---

## 2. Luồng hoạt động

### 2.1 Script `ensure-category-json.js`

- Quét cấu trúc **docs/** (category → section → article).
- Đọc/ghi **id** trong `_category.json` (category, section), **pathId** trong `_articles.json` (article).
- Sinh ra:
  - **`src/data/categories.generated.ts`**: cây `categories` → `sections` → `articles` (path, docPath, active, sort).
  - **`src/data/pathToDocPath.json`**: map path → docPath (chỉ **categories** và **sections**).
  - **`src/data/docPathToPath.json`**: map docPath → path (cho DocRoot replaceState).
  - **`src/data/articleIdToDocPath.json`**: map **pathId** (số) → `{ docPath, path }` (cho bài viết tra theo id).

### 2.2 Plugin `plugins/custom-doc-routes.js`

- Đọc `pathToDocPath.json` → thêm route **exact** cho từng category và section → component `DocPathRedirect` (redirect sang docPath, kèm state `fromPath`).
- Thêm **một** route `/articles/:pathIdAndSlug` (không exact) → component `ArticlePathRedirect` (tra bài theo **pathId**, bất kể slug).

### 2.3 Redirect và giữ URL

- **DocPathRedirect**: khi vào `/categories/...` hoặc `/sections/...` → `history.replace(docPath, { fromPath })` → trang doc tải, **DocRoot** đọc `state.fromPath` và `history.replaceState(fromPath)` → thanh địa chỉ hiển thị đúng path.
- **ArticlePathRedirect**: khi vào `/articles/1998028660-xyz` (slug bất kỳ) → lấy pathId `1998028660` → tra `articleIdToDocPath[pathId]` → redirect sang `docPath` với `fromPath` = path chuẩn (slug đúng) → DocRoot replaceState → URL hiển thị slug đúng.
- **DocRoot** (swizzle): nếu vào trực tiếp `/docs/...` (vd từ sidebar cũ) → tra `docPathToPath[pathname]` → replaceState sang path tương ứng → URL chuyển sang dạng `/categories/...`, `/sections/...`, `/articles/...`.

---

## 3. Bài viết đi theo id – Slug sai vẫn mở đúng bài

**Mục đích:** Bài viết được nhận diện bằng **id (pathId)**; phần slug trong URL có thể thay đổi hoặc sai, link vẫn mở đúng bài.

**Ví dụ:**

- Đúng: `http://savrse.savameta.local:3000/help/articles/1998028660-how-the-community-and-vr-app-work-together`
- Sai slug: `http://savrse.savameta.local:3000/help/articles/1998028660-how-the-community-and-vr-app-work-togetherabab`  
  → Vẫn mở đúng bài có id `1998028660`.

**Cách làm:**

- Route `/articles/:pathIdAndSlug` match mọi URL dạng `/articles/...`.
- Component **ArticlePathRedirect** lấy param `pathIdAndSlug`, tách phần **số** ở đầu (pathId).
- Tra **articleIdToDocPath.json**: `pathId` → `{ docPath, path }`.
- Redirect sang `docPath`, state `fromPath: path` (path chuẩn có slug đúng) → DocRoot replaceState → thanh địa chỉ hiển thị slug đúng.

**File liên quan:**

- `src/data/articleIdToDocPath.json`: sinh bởi `ensure-category-json.js`.
- `src/theme/ArticlePathRedirect/index.tsx`: redirect theo pathId.

---

## 4. Chuyển bài viết / section sang category hoặc section khác – Không lỗi

**Mục đích:** Khi chuyển bài viết ra sections hoặc categories khác thì link và redirect vẫn đúng.

- **Path** không phụ thuộc vị trí thư mục trong `docs/`; id/pathId lấy từ slug hoặc từ `_category.json` / `_articles.json`.
- Sau khi **di chuyển** file `.md` (hoặc cả folder section):
  1. Cập nhật `_articles.json` ở folder **đích** (thêm entry với `id` = tên file không đuôi; nếu muốn giữ URL cũ thì copy **pathId** từ entry cũ).
  2. Chạy **`yarn ensure-category-json`** và **`yarn generate-sidebar`** (hoặc `yarn dev` / `yarn build`).
- Script build lại **pathToDocPath**, **docPathToPath**, **articleIdToDocPath** theo cấu trúc **docs/** hiện tại → redirect và link sidebar/breadcrumb vẫn đúng.

---

## 5. Sidebar và breadcrumb dùng path

- **DocSidebarItem Link**: `to` = `getPathForDocPath(href) ?? href` (link bài/section/category dùng path). Active khi pathname (đã bỏ locale) trùng path.
- **DocSidebarItem Category**: `href` dùng path (`getPathForDocPath`); `isCurrentPage` so pathname với path.
- **DocBreadcrumbs**: breadcrumb dùng `getCategoryPathForSegment`, `getSectionPathForSegments`, `getPathForDocPath` → href là `/categories/...`, `/sections/...`, `/articles/...`.
- **DocCategoryGeneratedIndexPage**: breadcrumb parent và **DocCardList** dùng path (category path, và `getPathForDocPath` cho từng item).
- **HomepageFeatures**: `getActiveCategories()` trả về `path` (không còn docPath) → link category dùng `/categories/...`.

---

## 6. Tóm tắt file thay đổi / thêm mới

### Scripts

| File | Thay đổi |
|------|----------|
| `scripts/ensure-category-json.js` | Thêm id/pathId trong _category.json/_articles.json; sinh pathToDocPath (chỉ categories + sections), docPathToPath, **articleIdToDocPath**; comment về chuyển bài và route theo id. |

### Plugin

| File | Thay đổi |
|------|----------|
| `plugins/custom-doc-routes.js` | Route từ pathToDocPath (categories + sections) + **một** route `/articles/:pathIdAndSlug` → ArticlePathRedirect. |

### Config

| File | Thay đổi |
|------|----------|
| `docusaurus.config.ts` | Thêm `plugins: ['./plugins/custom-doc-routes.js']`. |

### Data (sinh bởi script)

| File | Mô tả |
|------|--------|
| `src/data/categories.generated.ts` | Cây categories → sections → articles (path, docPath, active, sort). |
| `src/data/categories.ts` | Export categories, getActiveCategories (path), getCategoryPathForSegment, getSectionPathForSegments, getPathForDocPath, getCategoryLabelForSegment; comment về chuyển bài. |
| `src/data/pathToDocPath.json` | Map path → docPath (chỉ categories và sections). |
| `src/data/docPathToPath.json` | Map docPath → path (DocRoot replaceState). |
| `src/data/articleIdToDocPath.json` | Map pathId → `{ docPath, path }` (bài viết tra theo id). |

### Theme components

| File | Mô tả |
|------|--------|
| `src/theme/DocPathRedirect/index.tsx` | Redirect path → docPath, state `fromPath` (cho categories/sections). |
| `src/theme/ArticlePathRedirect/index.tsx` | Redirect `/articles/:pathIdAndSlug` theo pathId; slug sai vẫn mở đúng bài. |
| `src/theme/DocRoot/index.tsx` | Swizzle: replaceState từ state.fromPath hoặc từ docPathToPath khi vào /docs/... |
| `src/theme/DocBreadcrumbs/index.tsx` | Breadcrumb href dùng path (getCategoryPathForSegment, getSectionPathForSegments, getPathForDocPath). |
| `src/theme/DocSidebarItem/Link/index.tsx` | Link `to` = getPathForDocPath(href); isActive theo pathname/path. |
| `src/theme/DocSidebarItem/Category/index.tsx` | Category href và isCurrentPage dùng path. |
| `src/theme/DocCategoryGeneratedIndexPage/index.tsx` | Breadcrumb parent và DocCardList items dùng path. |

### Docs

| File | Thay đổi |
|------|----------|
| `DOCUSAURUS_DOCS_FLOW.md` | Thêm mục "Chuyển bài viết / section sang category hoặc section khác". |

---

## 7. Lệnh cần chạy sau khi thay đổi cấu trúc docs

- **`yarn ensure-category-json`**: cập nhật _category.json (id), _articles.json (pathId), categories.generated.ts, pathToDocPath, docPathToPath, articleIdToDocPath.
- **`yarn generate-sidebar`**: cập nhật sidebars.autogenerated.js.
- Hoặc chạy **`yarn dev`** / **`yarn build`** (đã gọi các script trên).

---

## 8. Cấu trúc dữ liệu mẫu (categories)

```ts
categories: [
  {
    title: "getting-started",
    description: "...",
    path: "/categories/1443555064-getting-started",
    docPath: "/docs/getting-started",
    active: true,
    sort: 5,
    sections: [
      {
        title: "introduction-to-savrse",
        path: "/sections/1950491387-introduction-to-savrse",
        docPath: "/docs/getting-started/introduction-to-savrse",
        active: true,
        sort: 5,
        articles: [
          {
            title: "what-is-savrse",
            description: "...",
            path: "/articles/961964138-what-is-savrse",
            docPath: "/docs/getting-started/introduction-to-savrse/what-is-savrse",
            active: true,
            sort: 5,
          },
          // ...
        ],
      },
    ],
  },
]
```

- **path**: dùng cho URL và link (sidebar, breadcrumb, homepage).
- **docPath**: đường dẫn thật của Docusaurus docs; dùng nội bộ cho redirect và replaceState.
