/**
 * Categories từ cấu trúc docs/ (tự sinh bởi scripts/ensure-category-json.js).
 * Cấu trúc: categories → sections → articles. Path: /categories/id-slug, /sections/id-slug, /articles/pathId-slug.
 *
 * Khi chuyển bài viết sang section/category khác: chạy lại yarn ensure-category-json (và yarn generate-sidebar).
 * Path ổn định theo id/slug nên link /articles/..., /sections/..., /categories/... không đổi; mapping docPath được cập nhật theo docs/ hiện tại.
 */

export type { CategoryItem, SectionItem, ArticleItem } from './categories.generated';
export { categories } from './categories.generated';

import { categories } from './categories.generated';

/** Danh sách category đang bật, đã sắp xếp theo sort (dùng cho homepage; link dùng path /categories/...). */
export function getActiveCategories(): Array<{
  path: string;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  active: boolean;
  sort: number;
}> {
  return categories
    .filter((c) => c.active)
    .sort((a, b) => a.sort - b.sort)
    .map((c) => ({
      path: c.path,
      title: { en: slugToTitle(c.title), vi: slugToTitle(c.title) },
      description: { en: c.description, vi: c.description },
      active: c.active,
      sort: c.sort,
    }));
}

export type Locale = 'en' | 'vi';

/** Slug → tiêu đề: "sava-docs" → "Sava Docs". */
export function slugToTitle(slug: string): string {
  if (!slug || typeof slug !== 'string') return slug;
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Có phải chuỗi giống slug (chỉ chữ, số, dấu -). */
export function isSlugLike(title: string): boolean {
  if (!title || typeof title !== 'string') return false;
  return /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(title);
}

/** Tìm category theo segment doc (vd: "getting-started" → category có docPath /docs/getting-started). */
export function getCategoryByDocSegment(segment: string) {
  return categories.find((c) => c.docPath === `/docs/${segment}`);
}

/** path /categories/... của category theo segment (dùng cho breadcrumb link). */
export function getCategoryPathForSegment(segment: string): string | undefined {
  return getCategoryByDocSegment(segment)?.path;
}

/** path /sections/... của section theo category + section segment. */
export function getSectionPathForSegments(catSegment: string, sectionSegment: string): string | undefined {
  const cat = getCategoryByDocSegment(catSegment);
  if (!cat) return undefined;
  const sec = cat.sections.find((s) => s.title === sectionSegment);
  return sec?.path;
}

/** path /articles/... hoặc /categories/... hoặc /sections/... theo docPath. */
export function getPathForDocPath(docPath: string): string | undefined {
  for (const c of categories) {
    if (c.docPath === docPath) return c.path;
    for (const s of c.sections) {
      if (s.docPath === docPath) return s.path;
      for (const a of s.articles) {
        if (a.docPath === docPath) return a.path;
      }
    }
  }
  return undefined;
}

/** Nhãn category theo segment URL (getting-started → Getting Started). */
export function getCategoryLabelForSegment(
  segment: string,
  _locale: Locale
): string {
  const category = getCategoryByDocSegment(segment);
  if (category) return slugToTitle(category.title);
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}
