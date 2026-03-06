# Cách sử dụng thư mục `src/theme/`

## Tổng quan

Trong Docusaurus, thư mục **`src/theme/`** dùng để **ghi đè (override)** các component của theme mặc định (`docusaurus-theme-classic`). Khi build/chạy, Docusaurus ưu tiên dùng component trong `src/theme/` nếu có; không có thì dùng bản gốc của theme.

Cách tạo các file này: chạy **`yarn swizzle`** (hoặc `docusaurus swizzle`) rồi chọn component cần chỉnh → Docusaurus copy component từ theme vào `src/theme/` với cấu trúc thư mục tương ứng.

---

## Tự động ghi đè — không cần import hay đăng ký

**Bạn không cần import hoặc đăng ký component ở đâu cả.** Docusaurus dùng **alias** `@theme` trong bundler (Webpack):

1. **Thứ tự resolve `@theme/ComponentName`:**
   - **Ưu tiên 1:** `src/theme/` của project (vd. `src/theme/DocBreadcrumbs/index.tsx`) → nếu có file tương ứng thì dùng.
   - **Ưu tiên 2:** Thư mục theme của package (`docusaurus-theme-classic`) → dùng khi project không có bản ghi đè.

2. **Theme gốc** luôn import kiểu `import X from '@theme/DocBreadcrumbs'`. Khi build, bundler resolve `@theme` → trước tiên xem `src/theme/DocBreadcrumbs` có không; có thì dùng, không thì lấy từ theme package. **Không cần** thêm config hay import trong `docusaurus.config` — chỉ cần đặt file đúng đường dẫn trong `src/theme/`.

3. **Alias liên quan:**
   - **`@theme-original/ComponentName`** — trỏ tới bản gốc (chưa bị ghi đè), dùng khi bạn wrap component: import bản gốc rồi bọc thêm logic (vd. `DocItem` trong project import `@theme-original/DocItem`).
   - **`@theme-init/ComponentName`** — trỏ tới component gốc ở tầng dưới cùng (ít dùng khi chỉ tùy chỉnh site).

**Ví dụ cụ thể — breadcrumb:**  
Trong theme gốc (`node_modules/@docusaurus/theme-classic/lib/theme/DocItem/Layout/index.js`) có:

```js
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
// ...
<DocBreadcrumbs />
```

Khi build, mọi `import ... from '@theme/DocBreadcrumbs'` được resolve như sau:

1. Alias `@theme` → trỏ tới **`src/theme/`** của site (ưu tiên).
2. Bundler tìm module **`DocBreadcrumbs`** → tức là **`src/theme/DocBreadcrumbs/index.tsx`** (hoặc `.js`).
3. Nếu **có file đó** → dùng component của bạn (ghi đè).
4. Nếu **không có** → resolve tiếp vào theme package → dùng `theme-classic/lib/theme/DocBreadcrumbs/index.js`.

Vậy Docusaurus “biết” ghi đè breadcrumb **không phải** vì có đăng ký tên "breadcrumb", mà vì **đường dẫn import trùng với đường dẫn file**: theme luôn import `@theme/DocBreadcrumbs`, và bạn đặt file tại `src/theme/DocBreadcrumbs/index.tsx` → cùng một đường dẫn logic → bundler tự dùng file của bạn. **Tên thư mục / file phải khớp với tên sau `@theme/`** (vd. `@theme/DocSidebarItem/Link` → `src/theme/DocSidebarItem/Link/index.tsx`).

---

## Tên component: phải theo chuẩn Docusaurus, không tự đặt

**Bạn không được tự đặt tên** (vd. `MyBreadcrumbs`, `CustomBreadcrumb`). Theme gốc luôn import theo tên cố định, ví dụ:

- `import DocBreadcrumbs from '@theme/DocBreadcrumbs'`
- `import DocItemContent from '@theme/DocItem/Content'`
- `import DocSidebarItems from '@theme/DocSidebarItems'`

Bundler resolve `@theme/...` thành **đường dẫn trong `src/theme/`**. Nếu bạn đặt thư mục là `src/theme/MyBreadcrumbs/`, theme vẫn chỉ tìm `@theme/DocBreadcrumbs` → không tìm thấy file của bạn → dùng bản mặc định. Để ghi đè được, **tên thư mục và cấu trúc phải giống hệt** tên mà theme import:

| Theme import | Đường dẫn file trong project phải là |
|--------------|--------------------------------------|
| `@theme/DocBreadcrumbs` | `src/theme/DocBreadcrumbs/index.tsx` (hoặc index.js) |
| `@theme/DocItem/Content` | `src/theme/DocItem/Content/index.tsx` |
| `@theme/DocSidebarItem/Link` | `src/theme/DocSidebarItem/Link/index.tsx` |

**Cách biết tên chuẩn:** Xem trong theme (`node_modules/@docusaurus/theme-classic/lib/theme/`) hoặc chạy **`yarn swizzle`** — Docusaurus liệt kê đúng tên component và copy đúng cấu trúc vào `src/theme/` cho bạn.

Cấu hình theme trong **`docusaurus.config.ts`**:
- **`theme: { customCss: './src/css/custom.css' }`** — thêm CSS tùy chỉnh.
- **`themeConfig`** — cấu hình navbar, footer, prism, v.v. (không phải file trong `src/theme/`).

---

## Cấu trúc `src/theme/` trong project

| Thư mục / file | Vai trò | Khi nào được dùng |
|----------------|--------|--------------------|
| **DocBreadcrumbs/** | Breadcrumb trên trang doc (vd. Home > Avatars > Sava Avatar). | Mỗi trang doc (`.md` trong docs). |
| **DocCategoryGeneratedIndexPage/** | Trang index của category (vd. `/docs/avatars`, `/docs/worlds`). | Khi vào đường dẫn category (link "generated-index" trong sidebar). |
| **DocItem/** | Bọc toàn bộ nội dung một trang doc. | Mỗi trang doc. |
| **DocItem/Content/** | Phần nội dung chính: tiêu đề, MDX, thumbnail. | Bên trong DocItem. |
| **DocItem/DocThumbnail.tsx** | Hiển thị thumbnail từ frontmatter (`thumbnails`, `thumbnailPosition`). | Trong DocItem/Content khi doc có thumbnail. |
| **DocSidebar/Desktop/Content/** | Sidebar bên trái trên desktop: heading "Articles in this section" + danh sách mục. | Trang doc và trang category index. |
| **DocSidebarItem/Category/** | Một mục sidebar kiểu category (có con). | Sidebar. |
| **DocSidebarItem/Link/** | Một mục sidebar kiểu link (trang doc). | Sidebar. |

---

## Chi tiết từng phần

### 1. DocBreadcrumbs (`src/theme/DocBreadcrumbs/`)

- **Dùng khi:** Render breadcrumb trên mọi trang doc.
- **Logic tùy chỉnh:** Đọc `categories` và `getCategoryLabelForSegment` từ `src/data/categories`; hỗ trợ frontmatter `breadcrumb: [singularName, title]` để hiển thị nhãn tùy ý (vd. "Avatar" > "Sava Avatar"); hỗ trợ i18n qua `locale`.
- **Kết quả:** Breadcrumb đúng category và doc, có thể dịch theo locale.

### 2. DocCategoryGeneratedIndexPage (`src/theme/DocCategoryGeneratedIndexPage/`)

- **Dùng khi:** User vào trang index của một category (vd. `/docs/avatars`, `/docs/worlds`).
- **Logic tùy chỉnh:** Breadcrumb đơn giản (Home > Tên category) thay vì dùng DocBreadcrumbs để tránh gọi `useDoc()` ngoài DocProvider; dùng `DocCardList` để hiển thị danh sách bài trong category.
- **Kết quả:** Trang index category có layout và breadcrumb riêng của project.

### 3. DocItem (`src/theme/DocItem/`)

- **DocItem/index.tsx:** Wrapper gốc — hiện chỉ gọi bản gốc `@theme-original/DocItem` (wrapper, chưa chỉnh logic).
- **DocItem/Content/index.tsx:** Nội dung trang doc:
  - Tiêu đề: dùng `metadata.title`, nếu giống slug thì format bằng `slugToTitle` (vd. "Save-Intro" → "Save Intro").
  - Nội dung MDX.
  - Vị trí thumbnail: đọc `thumbnailPosition` từ frontmatter (`top` | `bottom` | `left` | `right`), mặc định `bottom`.
- **DocItem/DocThumbnail.tsx:** Hiển thị ảnh từ frontmatter:
  - `thumbnails: [{ url, width, height }, ...]` (nhiều ảnh),
  - hoặc `thumbnail`, `thumbnailWidth`, `thumbnailHeight` (một ảnh).
  - `thumbnailPosition` quyết định đặt ảnh ở đâu so với nội dung.

### 4. DocSidebar (`src/theme/DocSidebar/Desktop/Content/`)

- **Dùng khi:** Render sidebar desktop cho docs.
- **Logic tùy chỉnh:** Thêm heading "Articles in this section" phía trên danh sách mục; chuỗi này có thể dịch qua `theme.docs.sidebar.articlesInSection` trong i18n (vd. `i18n/vi/code.json`).
- **Kết quả:** Sidebar có tiêu đề section rõ ràng.

### 5. DocSidebarItem (`src/theme/DocSidebarItem/`)

- **Category/index.tsx:** Render mục sidebar là category (có mục con).
- **Link/index.tsx:** Render mục sidebar là link tới một doc:
  - Nhãn: nếu `label` giống slug (vd. "Save-Intro") thì dùng `slugToTitle` thành "Save Intro".
  - Dùng `isSlugLike`, `slugToTitle` từ `src/data/categories`.

---

## Luồng khi user xem trang

1. **Vào `/docs/worlds/new-world`:**
   - Layout doc: **DocItem** (wrapper) → **DocItem/Content** (tiêu đề + MDX + thumbnail nếu có).
   - Breadcrumb: **DocBreadcrumbs** (Home > Worlds > New World).
   - Sidebar: **DocSidebar/Desktop/Content** (heading + **DocSidebarItems** → **DocSidebarItem/Link** hoặc **Category** cho từng mục).

2. **Vào `/docs/worlds` (trang index category):**
   - Trang: **DocCategoryGeneratedIndexPage** (breadcrumb Home > Worlds, tiêu đề category, **DocCardList** các doc trong category).
   - Sidebar: cùng **DocSidebar** như trên.

---

## Tóm tắt

- **`src/theme/`** = bản ghi đè component của theme classic; Docusaurus tự resolve `@theme/...` từ đây.
- Mỗi component trong bảng trên được gọi đúng ngữ cảnh (doc page, category index, sidebar).
- Dữ liệu dùng chung: **`src/data/categories`** (categories, slugToTitle, isSlugLike, getCategoryLabelForSegment) cho breadcrumb và nhãn sidebar.
- Chuỗi UI (vd. "Articles in this section") dịch qua **i18n** (`code.json`, theme plugin).
