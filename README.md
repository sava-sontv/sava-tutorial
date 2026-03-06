# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server (default locale: **en**) and opens up a browser window. Most changes are reflected live without having to restart the server.

### Đa ngôn ngữ (i18n)

Trong chế độ dev, Docusaurus **chỉ chạy một locale tại một thời điểm**. Nếu bạn chạy `yarn start` rồi chuyển sang `/vi` sẽ gặp "Page not found" vì server đang phục vụ locale `en` thôi.

- **Xem site tiếng Việt khi dev:** chạy `yarn start:vi`, rồi mở `http://savrse.savameta.local:3000/help/vi/`.
- **Sau khi build (`yarn build`):** cả `/` (en) và `/vi/` đều hoạt động khi deploy thư mục `build`.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
