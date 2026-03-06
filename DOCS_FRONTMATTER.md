# Sửa thứ tự và ẩn/hiện: dùng file JSON (một tên thống nhất)

## Folder (cả thư mục): `_category_.json` + `_category.json`

Trong mỗi thư mục `docs/<folder>/`:

- **`_category_.json`**: chỉ dùng cho Docusaurus (label, position, link) – không thêm trường khác.
- **`_category.json`**: dùng cho trang chủ (active, sort):
  - **`active`**: `true` / `false` → hiện/ẩn category trên trang chủ
  - **`sort`**: số → thứ tự category (nhỏ lên trước), thường nhảy bước 5

Khi chạy **`yarn dev`** (hoặc **`yarn start`**), watcher tự chạy: sửa `_category.json` (hoặc `_articles.json`) → script tự chạy lại → giao diện cập nhật (hot reload). Để watch ổn định trên Windows: `yarn add -D chokidar`. Nếu không dùng dev/start, sửa xong chạy `yarn ensure-category-json` (và `yarn apply-articles-json` nếu sửa bài).

---

## Từng bài trong thư mục: `_articles.json`

Mỗi thư mục `docs/<folder>/` có **một file chung** **`_articles.json`** – danh sách bài, cấu trúc giống folder (active, sort), **sort nhảy bước 5** (5, 10, 15, 20, ...):

```json
[
  { "id": "sava-avatar", "active": true, "sort": 5 },
  { "id": "sava-docs", "active": true, "sort": 10 },
  { "id": "Save-Intro", "active": false, "sort": 15 }
]
```

- **`id`**: tên file không đuôi (vd. `sava-avatar` cho `sava-avatar.md`)
- **`active`**: `true` = hiện trong sidebar/danh sách, `false` = ẩn (unlisted)
- **`sort`**: số, nhảy bước 5 (5, 10, 15, ...) – nhỏ lên trước

Script **tự sinh** `_articles.json` khi thêm hoặc sửa file `.md`: thêm bài mới vào danh sách với `active: true` và `sort` bước 5. Bạn chỉ cần sửa file `_articles.json` (thứ tự, active) giống như sửa `_category.json`.

Khi chạy **`yarn dev`** (hoặc **`yarn start`**), watcher tự chạy: sửa `_articles.json` → script tự chạy `generate-sidebar` → sidebar cập nhật ngay. Sidebar được generate trực tiếp từ `_articles.json` (không cần ghi frontmatter). Nếu không dùng dev/start: sửa xong chạy **`yarn generate-sidebar`** (hoặc **`yarn build`**) → sidebar được regenerate từ JSON.

**Tên thống nhất:** Cả category meta và articles đều dùng một tên: **`_category.json`** (active/sort cho folder), **`_articles.json`** (danh sách bài). File cũ `_category_.meta.json` / `_articles_.json` sẽ được script tự migrate khi chạy.

---

## Frontmatter trong file .md (title, slug, tags, …)

Khi **generate** hoặc viết frontmatter (Decap CMS, script, API):

- **tags** có ký tự đặc biệt (dấu chấm, số giống version): **luôn để trong dấu ngoặc** để YAML parse thành chuỗi, tránh lỗi.
  - Sai: `tags: - 6.1.1` (có thể bị parse thành số float).
  - Đúng: `tags: - "6.1.1"` hoặc `tags: ["6.1.1"]`.
- **slug** thường chỉ chữ, số, dấu gạch ngang; nếu có ký tự khác thì cũng nên bọc trong dấu ngoặc.

Ví dụ frontmatter an toàn:

```yaml
---
title: Installing Savrse Studio
slug: installing-savrse-studio
tags:
  - "6.1.1"
sidebar_position: 5
---
```
