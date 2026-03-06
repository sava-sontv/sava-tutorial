# Luồng dịch i18n cho nội dung docs

## Vì sao `/vi` báo Page Not Found khi chạy dev?

Trong **chế độ development**, Docusaurus **chỉ load một locale tại một thời điểm** (để khởi động nhanh). Khi chạy `yarn dev` (không truyền `--locale`), chỉ locale mặc định **en** được load.

- `http://savrse.savameta.local:3000/help/` → hoạt động (trang chủ en).
- `http://savrse.savameta.local:3000/help/vi` → **404** vì locale **vi** không được load trong dev server đó.

**Cách xử lý:**

1. **Xem trang tiếng Việt trong dev:** chạy `yarn dev:vi` (hoặc `yarn start:vi`). Khi đó server chỉ load locale **vi**, và **trang chủ** là `http://savrse.savameta.local:3000/help/` (đã là bản vi, không có prefix `/vi`).
2. **Xem cả `/` và `/vi` cùng lúc:** chạy `yarn build` rồi `yarn serve`. Build production có đủ locale → `/` là en, `/vi` là vi.

---

## Cách Docusaurus xử lý docs theo locale

- **Locale mặc định (en):** nội dung docs lấy từ thư mục **`docs/`**.
- **Locale khác (vi):** nội dung docs lấy từ **`i18n/vi/docusaurus-plugin-content-docs/current/`** — cấu trúc thư mục giống `docs/`, mỗi file `.md`/`.mdx` là bản dịch tương ứng.

Docusaurus **không** tách từng câu trong doc ra để dịch; mỗi file markdown được dịch **trọn vẹn** theo locale.

---

## Hai loại “dịch” trong project

| Loại | Nơi chứa | Cách dịch |
|------|----------|-----------|
| **UI (navbar, footer, nhãn theme)** | `i18n/vi/code.json`, `i18n/vi/docusaurus-theme-classic/*.json` | `yarn write-translations` extract chuỗi → chỉnh/sửa JSON. |
| **Nội dung docs (.md)** | `i18n/vi/docusaurus-plugin-content-docs/current/**/*.md` | Chỉnh trực tiếp nội dung từng file .md (hoặc dùng tool/Crowdin). |

Lệnh **`yarn write-translations`** chỉ dùng cho chuỗi UI (theme, plugin), **không** dùng để dịch nội dung body của docs.

---

## Luồng dịch nội dung docs (locale vi)

### Bước 1: Đồng bộ cấu trúc và bản gốc (en → vi)

```bash
yarn sync-docs-i18n
```

- Copy toàn bộ **`docs/`** → **`i18n/vi/docusaurus-plugin-content-docs/current/`** (bao gồm `.md`, `_category_.json`, `_category.json`, `_articles.json`).
- Kết quả: locale **vi** có cùng cấu trúc và **nội dung tiếng Anh** (bản copy) làm điểm bắt đầu để dịch.

**Lưu ý:** Mỗi lần chạy `sync-docs-i18n` sẽ **ghi đè** toàn bộ file trong `i18n/vi/.../current/`. Nếu bạn đã dịch xong một số file, chạy lại sync sẽ **mất bản dịch** ở những file bị ghi đè. Nên:
- Chạy sync khi: mới bật i18n, hoặc thêm doc mới và chưa dịch.
- Sau khi đã dịch: **không** chạy sync (hoặc dùng script sync “chỉ thêm mới / không ghi đè file đã tồn tại” nếu có).

### Bước 2: Dịch nội dung

Chỉnh trực tiếp các file markdown trong **`i18n/vi/docusaurus-plugin-content-docs/current/`**:

- Ví dụ: `i18n/vi/.../current/avatars/sava-avatar.md` → sửa nội dung (và frontmatter title/description nếu cần) sang tiếng Việt.
- Có thể dịch từng doc một; doc chưa dịch vẫn hiển thị bản en (vì ban đầu là copy từ `docs/`).

Nếu muốn dùng công cụ:
- Dịch bằng tay trong editor.
- Hoặc dùng dịch máy / Crowdin / script đọc `docs/**/*.md` và ghi bản dịch tương ứng vào `i18n/vi/.../current/**/*.md` (giữ đúng đường dẫn tương đối).

### Bước 3: (Tùy chọn) Dịch nhãn category

- File **`_category_.json`** trong từng folder có `label` (và `link.title`, `link.description`) — có thể sửa trong **`i18n/vi/.../current/<folder>/_category_.json`** để nhãn sidebar/trang index tiếng Việt.
- **`_category.json`** và **`_articles.json`** dùng cho active/sort; thường không cần dịch, giữ đồng bộ với bên `docs/` (sync đã copy).

### Bước 4: Chạy / build với locale vi

- **Dev (chỉ locale vi):**
  ```bash
  yarn dev:vi
  # hoặc
  yarn start:vi
  ```
  Mở site với nội dung docs lấy từ `i18n/vi/.../current/`.

- **Build toàn bộ (en + vi):**
  ```bash
  yarn build
  ```
  Build sẽ chạy `sync-docs-i18n` trước → **sẽ ghi đè lại toàn bộ i18n/vi/.../current/** nếu không đổi script. Nếu đã dịch, cần bỏ bước sync khỏi `build` hoặc đổi sang sync “chỉ thêm file mới / không ghi đè file đã có”.

- **Xem bản build:**
  ```bash
  yarn serve
  ```
  Vào `/vi/docs/...` để xem docs tiếng Việt.

---

## Tóm tắt luồng

```
docs/ (en - nguồn)
    │
    │  yarn sync-docs-i18n  (chỉ chạy khi cần “reset” vi hoặc thêm doc mới)
    ▼
i18n/vi/docusaurus-plugin-content-docs/current/  (vi - bản dịch)
    │
    │  Chỉnh sửa / dịch từng .md (và _category_.json nếu cần)
    ▼
yarn build  (không chạy sync nếu đã dịch)  hoặc  yarn dev:vi
    │
    ▼
Site: /docs/... = en,  /vi/docs/... = vi
```

---

## Lệnh liên quan

| Lệnh | Mục đích |
|------|----------|
| `yarn sync-docs-i18n` | Copy `docs/` → `i18n/vi/.../current/` (ghi đè — cẩn thận khi đã dịch). |
| `yarn write-translations` | Extract chuỗi UI (theme, plugin) ra file JSON để dịch navbar/footer, **không** dịch nội dung docs. |
| `yarn dev:vi` / `yarn start:vi` | Chạy dev với locale vi (docs từ `i18n/vi/.../current/`). |
| `yarn build` | Hiện tại có chạy `sync-docs-i18n` → sẽ ghi đè i18n vi; cần điều chỉnh nếu muốn giữ bản dịch. |

---

## Khuyến nghị khi đã dịch nội dung docs

1. **Tránh ghi đè bản dịch:**  
   Hoặc bỏ `yarn sync-docs-i18n` khỏi `build`, hoặc đổi script sync thành “chỉ copy file/cấu trúc mới, không ghi đè file .md đã tồn tại trong i18n/vi”.

2. **Doc mới (en):**  
   Thêm file trong `docs/` → copy thủ công (hoặc chạy sync một lần) file đó sang đúng đường dẫn trong `i18n/vi/.../current/` rồi dịch; tránh chạy sync toàn bộ nếu đã có nhiều file vi đã dịch.

3. **UI (navbar, footer):**  
   Dùng `yarn write-translations` rồi sửa `i18n/vi/code.json` và `i18n/vi/docusaurus-theme-classic/*.json` cho nhãn tiếng Việt.

Nếu bạn muốn, có thể thêm script sync “chỉ thêm mới / không ghi đè” và cập nhật `package.json` (ví dụ `sync-docs-i18n-safe`) để dùng trong luồng dịch lâu dài.
