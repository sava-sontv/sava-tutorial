/**
 * Plugin thêm route /categories/..., /sections/:pathIdAndSlug, /articles/:pathIdAndSlug.
 */
const path = require('path');
const fs = require('fs');

module.exports = function customDocRoutes(context) {
  const siteDir = context.siteDir;
  const baseUrl = context.siteConfig?.baseUrl ?? '/';
  const routePrefix = baseUrl.replace(/\/$/, '') || '';
  const i18n = context.i18n;
  const locales = i18n?.locales ?? [];
  const defaultLocale = i18n?.defaultLocale ?? 'en';
  const pathToDocPathPath = path.join(siteDir, 'src', 'data', 'pathToDocPath.json');
  const articleIdPath = path.join(siteDir, 'src', 'data', 'articleIdToDocPath.json');
  const sectionIdPath = path.join(siteDir, 'src', 'data', 'sectionIdToPath.json');
  const categoryIdPath = path.join(siteDir, 'src', 'data', 'categoryIdToPath.json');

  function fullPath(p, locale) {
    if (!routePrefix || routePrefix === '/') {
      if (!locale || locale === defaultLocale) return p;
      return '/' + locale + p;
    }
    const prefix = locale && locale !== defaultLocale ? `${routePrefix}/${locale}` : routePrefix;
    return prefix + p;
  }

  function* pathVariants(p) {
    yield fullPath(p);
    for (const locale of locales) {
      if (locale !== defaultLocale) yield fullPath(p, locale);
    }
  }

  return {
    name: 'custom-doc-routes',
    contentLoaded({ actions }) {
      const { addRoute } = actions;

      if (fs.existsSync(pathToDocPathPath)) {
        const pathToDocPath = JSON.parse(fs.readFileSync(pathToDocPathPath, 'utf8'));
        for (const [routePath, docPath] of Object.entries(pathToDocPath)) {
          if (routePath.startsWith('/sections/')) continue;
          if (routePath.startsWith('/categories/')) continue;
          for (const pathToAdd of pathVariants(routePath)) {
            addRoute({
              path: pathToAdd,
              component: '@theme/DocPathRedirect',
              exact: true,
              props: { path: routePath, docPath },
            });
          }
        }
      }

      if (fs.existsSync(categoryIdPath)) {
        const categoryIdToPath = JSON.parse(
          fs.readFileSync(categoryIdPath, 'utf8')
        );
        for (const entry of Object.values(categoryIdToPath)) {
          if (entry.path) {
            for (const pathToAdd of pathVariants(entry.path)) {
              addRoute({
                path: pathToAdd,
                component: '@theme/CategoryPathRedirect',
                exact: true,
              });
            }
          }
        }
      }

      if (fs.existsSync(sectionIdPath)) {
        const sectionIdToPath = JSON.parse(
          fs.readFileSync(sectionIdPath, 'utf8')
        );
        for (const entry of Object.values(sectionIdToPath)) {
          if (entry.path) {
            for (const pathToAdd of pathVariants(entry.path)) {
              addRoute({
                path: pathToAdd,
                component: '@theme/SectionPathRedirect',
                exact: true,
              });
            }
          }
        }
      }

      if (fs.existsSync(articleIdPath)) {
        const articleIdToDocPath = JSON.parse(
          fs.readFileSync(articleIdPath, 'utf8')
        );
        for (const entry of Object.values(articleIdToDocPath)) {
          if (entry.path) {
            for (const pathToAdd of pathVariants(entry.path)) {
              addRoute({
                path: pathToAdd,
                component: '@theme/ArticlePathRedirect',
                exact: true,
              });
            }
          }
        }
      }
    },
  };
};
