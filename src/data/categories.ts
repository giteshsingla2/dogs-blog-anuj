import categoriesData from "./categories.json";

export interface Category {
  name: string;
  slug: string;
  color: string;
  tagColor: string;
}

export const categories: Category[] = categoriesData as Category[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find(c => c.name.toLowerCase() === name.toLowerCase());
}
