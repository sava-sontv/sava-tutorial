# Tên chuẩn component theme Docusaurus (dùng để ghi đè)

Để ghi đè component, bạn đặt file tại **`src/theme/<TênComponent>/index.tsx`** (hoặc `.js`). **Tên thư mục phải khớp chính xác** với tên bên dưới (phân biệt hoa thường).

---

## Cách tự xem danh sách chuẩn

1. **Chạy `yarn swizzle`** (hoặc `npx docusaurus swizzle`) — Docusaurus liệt kê component có thể swizzle và copy đúng cấu trúc vào `src/theme/`.
2. **Xem trong theme package:**  
   `node_modules/@docusaurus/theme-classic/lib/theme/` — mỗi thư mục (có `index.js`) = một tên component. Đường dẫn trong đó (dùng `/`) chính là phần sau `@theme/`.

---

## Liệt kê tên chuẩn (theo cấu trúc theme-classic)

### Docs (trang doc, sidebar, breadcrumb, category index)

| Tên component (đường dẫn trong `src/theme/`) | Mô tả ngắn |
|---------------------------------------------|------------|
| **DocBreadcrumbs** | Breadcrumb trên trang doc |
| **DocBreadcrumbs/Items/Home** | Mục "Home" trong breadcrumb |
| **DocBreadcrumbs/StructuredData** | Dữ liệu cấu trúc breadcrumb (SEO) |
| **DocCard** | Thẻ một doc trong danh sách |
| **DocCardList** | Danh sách thẻ doc (trang category index) |
| **DocCategoryGeneratedIndexPage** | Trang index category (vd. /docs/worlds) |
| **DocItem** | Bọc toàn bộ trang doc |
| **DocItem/Content** | Nội dung chính trang doc (tiêu đề + MDX) |
| **DocItem/Footer** | Footer trang doc |
| **DocItem/Layout** | Layout trang doc (breadcrumb, TOC, content...) |
| **DocItem/Metadata** | Metadata trang doc |
| **DocItem/Paginator** | Nút prev/next trang |
| **DocItem/TOC/Desktop** | Mục lục (desktop) |
| **DocItem/TOC/Mobile** | Mục lục (mobile) |
| **DocPaginator** | Thanh phân trang doc |
| **DocRoot/Layout/Main** | Layout chính khu vực doc |
| **DocRoot/Layout/Sidebar** | Layout sidebar doc |
| **DocSidebar** | Sidebar trang doc |
| **DocSidebar/Desktop/CollapseButton** | Nút thu gọn sidebar (desktop) |
| **DocSidebar/Desktop/Content** | Nội dung sidebar desktop |
| **DocSidebar/Mobile** | Sidebar mobile |
| **DocSidebarItem** | Một mục sidebar (phân loại Category/Link/Html) |
| **DocSidebarItem/Category** | Mục sidebar kiểu category |
| **DocSidebarItem/Html** | Mục sidebar HTML tùy ý |
| **DocSidebarItem/Link** | Mục sidebar kiểu link (trang doc) |
| **DocSidebarItems** | Danh sách mục sidebar (render đệ quy) |
| **DocsRoot** | Root component khu vực docs |
| **DocTagDocListPage** | Trang danh sách doc theo tag |
| **DocTagsListPage** | Trang danh sách tag |
| **DocVersionBadge** | Badge phiên bản doc |
| **DocVersionBanner** | Banner phiên bản doc |
| **DocVersionRoot** | Root phiên bản doc |

### Layout, Navbar, Footer

| Tên component | Mô tả ngắn |
|--------------|------------|
| **Layout** | Layout toàn site (navbar + main + footer) |
| **Navbar** | Thanh điều hướng trên |
| **NavbarItem/ComponentTypes** | Map loại item navbar → component |
| **Footer** | Footer site |
| **Footer/Copyright** | Dòng copyright |
| **Footer/Layout** | Layout footer |
| **Footer/LinkItem** | Một link trong footer |
| **Footer/Links** | Khối links footer |
| **Footer/Links/MultiColumn** | Links nhiều cột |
| **Footer/Links/Simple** | Links một hàng |
| **Footer/Logo** | Logo footer |
| **SkipToContent** | Link "skip to content" (a11y) |
| **AnnouncementBar** | Thanh thông báo trên cùng |
| **AnnouncementBar/CloseButton** | Nút đóng announcement |
| **AnnouncementBar/Content** | Nội dung announcement |
| **BackToTopButton** | Nút back to top |
| **ColorModeToggle** | Chuyển light/dark mode — **sửa tại:** `src/theme/ColorModeToggle/index.tsx` (logic, label) và `styles.module.css` (style nút) |
| **Navbar/ColorModeToggle** | Wrapper đặt nút theme trong navbar — **sửa tại:** `src/theme/Navbar/ColorModeToggle/index.tsx` (ẩn/điều kiện hiển thị) hoặc `styles.module.css` (style trong navbar) |

### Blog (nếu bật blog)

| Tên component | Mô tả ngắn |
|--------------|------------|
| **BlogLayout** | Layout trang blog |
| **BlogListPage** | Trang danh sách bài blog |
| **BlogListPaginator** | Phân trang danh sách blog |
| **BlogPostItem** | Một item bài blog |
| **BlogPostItem/Container** | Bọc một bài |
| **BlogPostItem/Content** | Nội dung bài |
| **BlogPostItem/Footer** | Footer bài |
| **BlogPostItem/Header** | Header bài |
| **BlogPostItems** | Danh sách bài blog |
| **BlogPostPage** | Trang một bài blog |
| **BlogPostPaginator** | Prev/next bài |
| **BlogSidebar** | Sidebar blog |
| **BlogArchivePage** | Trang archive blog |
| **BlogTagsListPage** | Trang danh sách tag |
| **BlogTagsPostsPage** | Trang bài theo tag |
| **Blog/Components/Author** | Component tác giả |
| **Blog/Pages/BlogAuthorsListPage** | Trang danh sách tác giả |
| **Blog/Pages/BlogAuthorsPostsPage** | Trang bài theo tác giả |

### Nội dung MDX, code, admonition

| Tên component | Mô tả ngắn |
|--------------|------------|
| **MDXContent** | Bọc nội dung MDX |
| **MDXComponents** | Map component MDX (Code, A, Details...) |
| **MDXComponents/A** | Link trong MDX |
| **MDXComponents/Code** | Code block trong MDX |
| **MDXComponents/Details** | Thẻ details |
| **MDXComponents/Heading** | Heading trong MDX |
| **MDXComponents/Img** | Ảnh trong MDX |
| **MDXComponents/Pre** | Thẻ pre |
| **MDXComponents/Ul** | Danh sách ul |
| **CodeBlock** | Khối code (Prism) |
| **CodeBlock/Buttons** | Nút copy, word wrap... |
| **CodeBlock/Container** | Bọc code block |
| **CodeBlock/Content** | Nội dung code |
| **CodeBlock/Layout** | Layout code block |
| **CodeBlock/Line** | Một dòng code |
| **CodeBlock/Title** | Tiêu đề code block |
| **CodeInline** | Code nội dòng |
| **Admonition** | Khối admonition (note, tip, warning...) |
| **Admonition/Layout** | Layout admonition |
| **Admonition/Type/Note** | Admonition :::note |
| **Admonition/Type/Tip** | :::tip |
| **Admonition/Type/Info** | :::info |
| **Admonition/Type/Warning** | :::warning |
| **Admonition/Type/Danger** | :::danger |
| **Admonition/Type/Caution** | :::caution |
| **Details** | Component details |
| **TOC** | Mục lục |
| **TOCItems** | Các mục TOC |
| **TOCCollapsible** | TOC thu gọn (mobile) |
| **ContentVisibility** | Hiển thị draft/unlisted |
| **ContentVisibility/Draft** | Banner draft |
| **ContentVisibility/Unlisted** | Banner unlisted |

### Khác

| Tên component | Mô tả ngắn |
|--------------|------------|
| **Heading** | Component heading (h1, h2...) |
| **NotFound** | Trang 404 |
| **ErrorPageContent** | Nội dung trang lỗi |
| **Logo** | Logo navbar |
| **Tag** | Thẻ tag |
| **TagsListInline** | Danh sách tag nội dòng |
| **TagsListByLetter** | Danh sách tag theo chữ cái |
| **ThemedImage** | Ảnh theo theme (light/dark) |
| **PaginatorNavLink** | Link prev/next phân trang |
| **EditThisPage** | Link "Edit this page" |
| **EditMetaRow** | Dòng metadata (edit, last updated) |
| **LastUpdated** | "Last updated" |
| **SearchBar** | Ô tìm kiếm (navbar) |
| **SearchMetadata** | Metadata tìm kiếm |
| **Mermaid** | Biểu đồ Mermaid |
| **ThemeProvider** | Provider theme |
| **prism-include-languages** | Cấu hình ngôn ngữ Prism (không phải React component) |

### Icon (thư mục Icon — swizzle từng icon con)

| Tên component | Mô tả ngắn |
|--------------|------------|
| **Icon/Arrow** | Icon mũi tên |
| **Icon/Close** | Icon đóng |
| **Icon/DarkMode** | Icon dark mode |
| **Icon/Edit** | Icon sửa |
| **Icon/LightMode** | Icon light mode |
| **Icon/Menu** | Icon menu |
| **Icon/Home** | Icon home |
| **Icon/ExternalLink** | Icon link ngoài |
| **Icon/Socials/*** | Các icon mạng xã hội (Twitter, GitHub, ...) |

---

## Quy tắc

- **Tên phải khớp chính xác** (kể cả hoa/thường): `DocBreadcrumbs` ≠ `docBreadcrumbs`.
- **Đường dẫn = cấu trúc thư mục:** `DocItem/Content` → `src/theme/DocItem/Content/index.tsx`.
- **File entry:** Thường là `index.js` hoặc `index.tsx` trong thư mục đó.
- Danh sách đầy đủ theo phiên bản theme nằm trong **`node_modules/@docusaurus/theme-classic/lib/theme/`** — có thể so sánh thư mục đó với file này nếu nâng cấp Docusaurus.
