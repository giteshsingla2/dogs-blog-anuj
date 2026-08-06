import postsData from "./posts.json";

export interface Post {
  slug: string;
  title: string;
  category: string;
  tagColor: 'rust' | 'green' | 'gold' | 'teal' | 'ink';
  date: string;
  author?: string;
  readTime?: string;
  summary: string;
  contentHtml: string;
  gradient?: string;
  artStyleId?: string; // Identifier for the SVG artwork
  imageUrl?: string; // Optional external featured image URL
}

export const posts: Post[] = postsData as Post[];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getLatestPosts(limit = 4): Post[] {
  return posts.filter(p => ["Rescue Stories", "Breed Spotlight", "Puppy Life", "Training"].includes(p.category)).slice(0, limit);
}
