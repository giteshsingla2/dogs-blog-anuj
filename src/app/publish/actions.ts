"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { Post } from "@/data/posts";

interface Category {
  name: string;
  slug: string;
  color: string;
  tagColor: string;
}

// Dynamic categories reader helper
function loadCategories(): Category[] {
  const filePath = path.join(process.cwd(), "src", "data", "categories.json");
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  }
  return [];
}

// 1. CREATE: Publish a New Story
export async function publishPost(prevState: any, formData: FormData) {
  try {
    const title = formData.get("title")?.toString().trim();
    const slugInput = formData.get("slug")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const author = formData.get("author")?.toString().trim() || "Good Dog Gazette Staff";
    const summary = formData.get("summary")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const artStyleId = formData.get("artStyleId")?.toString().trim() || undefined;
    const gradient = formData.get("gradient")?.toString().trim() || undefined;
    const imageUrl = formData.get("imageUrl")?.toString().trim() || undefined;

    if (!title || !slugInput || !category || !summary || !content) {
      return { error: "Please fill in all required fields." };
    }

    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      return { error: "Invalid slug name." };
    }

    const filePath = path.join(process.cwd(), "src", "data", "posts.json");
    
    let currentPosts: Post[] = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      currentPosts = JSON.parse(fileData);
    }

    const duplicate = currentPosts.some(p => p.slug === slug);
    if (duplicate) {
      return { error: `An article with slug "${slug}" already exists. Please choose a different slug.` };
    }

    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    
    const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date().toLocaleDateString("en-US", dateOptions);

    const cats = loadCategories();
    const matchedCat = cats.find(c => c.name === category);
    const tagColor = (matchedCat?.tagColor || "ink") as "ink" | "rust" | "green" | "gold" | "teal";

    let contentHtml = content;
    if (!content.includes("<p>") && !content.includes("<div>")) {
      contentHtml = content
        .split(/\r?\n\s*\r?\n/)
        .map(p => `<p>${p.replace(/\r?\n/g, "<br/>")}</p>`)
        .join("\n");
    }

    const newPost: Post = {
      slug,
      title,
      category,
      tagColor,
      date,
      author,
      readTime,
      summary,
      contentHtml,
      gradient: gradient || undefined,
      artStyleId: artStyleId || undefined,
      imageUrl: imageUrl || undefined
    };

    currentPosts.unshift(newPost);
    fs.writeFileSync(filePath, JSON.stringify(currentPosts, null, 2), "utf-8");

    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    
    if (matchedCat) {
      revalidatePath(`/category/${matchedCat.slug}`);
    }

    return { success: true, slug };
  } catch (err: any) {
    console.error("Publishing error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

// 2. UPDATE: Edit an Existing Story
export async function updatePost(originalSlug: string, formData: FormData) {
  try {
    const title = formData.get("title")?.toString().trim();
    const slugInput = formData.get("slug")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const author = formData.get("author")?.toString().trim() || "Good Dog Gazette Staff";
    const summary = formData.get("summary")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const artStyleId = formData.get("artStyleId")?.toString().trim() || undefined;
    const gradient = formData.get("gradient")?.toString().trim() || undefined;
    const imageUrl = formData.get("imageUrl")?.toString().trim() || undefined;

    if (!originalSlug || !title || !slugInput || !category || !summary || !content) {
      return { error: "Please fill in all required fields." };
    }

    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      return { error: "Invalid slug name." };
    }

    const filePath = path.join(process.cwd(), "src", "data", "posts.json");
    if (!fs.existsSync(filePath)) {
      return { error: "Database file not found." };
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const currentPosts: Post[] = JSON.parse(fileData);

    const postIndex = currentPosts.findIndex(p => p.slug === originalSlug);
    if (postIndex === -1) {
      return { error: "Article to update not found." };
    }

    const duplicate = currentPosts.some((p, idx) => p.slug === slug && idx !== postIndex);
    if (duplicate) {
      return { error: `An article with slug "${slug}" already exists.` };
    }

    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const cats = loadCategories();
    const matchedCat = cats.find(c => c.name === category);
    const tagColor = (matchedCat?.tagColor || "ink") as "ink" | "rust" | "green" | "gold" | "teal";

    let contentHtml = content;
    if (!content.includes("<p>") && !content.includes("<div>")) {
      contentHtml = content
        .split(/\r?\n\s*\r?\n/)
        .map(p => `<p>${p.replace(/\r?\n/g, "<br/>")}</p>`)
        .join("\n");
    }

    const originalPost = currentPosts[postIndex];

    const updatedPost: Post = {
      ...originalPost,
      slug,
      title,
      category,
      tagColor,
      author,
      readTime,
      summary,
      contentHtml,
      gradient: gradient || undefined,
      artStyleId: artStyleId || undefined,
      imageUrl: imageUrl || undefined
    };

    currentPosts[postIndex] = updatedPost;
    fs.writeFileSync(filePath, JSON.stringify(currentPosts, null, 2), "utf-8");

    revalidatePath("/");
    revalidatePath(`/posts/${originalSlug}`);
    revalidatePath(`/posts/${slug}`);
    
    const oldCat = cats.find(c => c.name === originalPost.category);
    if (oldCat) revalidatePath(`/category/${oldCat.slug}`);
    if (matchedCat) revalidatePath(`/category/${matchedCat.slug}`);

    return { success: true, slug };
  } catch (err: any) {
    console.error("Updating error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

// 3. DELETE: Remove a Story
export async function deletePost(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "posts.json");
    if (!fs.existsSync(filePath)) {
      return { error: "Database file not found." };
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const currentPosts: Post[] = JSON.parse(fileData);

    const postToDelete = currentPosts.find(p => p.slug === slug);
    if (!postToDelete) {
      return { error: "Post not found." };
    }

    const updatedPosts = currentPosts.filter(p => p.slug !== slug);
    fs.writeFileSync(filePath, JSON.stringify(updatedPosts, null, 2), "utf-8");

    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);

    const cats = loadCategories();
    const matchedCat = cats.find(c => c.name === postToDelete.category);
    if (matchedCat) {
      revalidatePath(`/category/${matchedCat.slug}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Deleting error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

// 4. CREATE: Add a Category
export async function addCategory(name: string) {
  try {
    const trimmed = name.trim();
    if (!trimmed) {
      return { error: "Category name cannot be empty." };
    }

    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      return { error: "Invalid category name." };
    }

    const filePath = path.join(process.cwd(), "src", "data", "categories.json");
    let currentCats: Category[] = [];
    if (fs.existsSync(filePath)) {
      currentCats = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    if (currentCats.some(c => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase())) {
      return { error: `Category "${trimmed}" already exists.` };
    }

    const colors = ["rust", "gold", "teal", "green", "ink"];
    const cssColors = ["var(--rust)", "var(--gold-deep)", "var(--teal)", "var(--green)", "var(--ink-soft)"];
    
    const idx = currentCats.length % colors.length;
    const tagColor = colors[idx];
    const cssColor = cssColors[idx];

    const newCat: Category = {
      name: trimmed,
      slug,
      color: cssColor,
      tagColor
    };

    currentCats.push(newCat);
    fs.writeFileSync(filePath, JSON.stringify(currentCats, null, 2), "utf-8");

    revalidatePath("/");
    revalidatePath(`/category/${slug}`);

    return { success: true, slug };
  } catch (err: any) {
    console.error("Add category error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

// 5. DELETE: Remove a Category
export async function deleteCategory(slug: string) {
  try {
    if (slug === "other") {
      return { error: "The default category 'Other' cannot be deleted." };
    }

    const filePath = path.join(process.cwd(), "src", "data", "categories.json");
    if (!fs.existsSync(filePath)) {
      return { error: "Categories database file not found." };
    }

    let currentCats: Category[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const catToDelete = currentCats.find(c => c.slug === slug);
    if (!catToDelete) {
      return { error: "Category not found." };
    }

    const updatedCats = currentCats.filter(c => c.slug !== slug);
    fs.writeFileSync(filePath, JSON.stringify(updatedCats, null, 2), "utf-8");

    // Relink posts inside that category to "Other"
    const postsFilePath = path.join(process.cwd(), "src", "data", "posts.json");
    if (fs.existsSync(postsFilePath)) {
      const postsData = fs.readFileSync(postsFilePath, "utf-8");
      const currentPosts: Post[] = JSON.parse(postsData);

      let postsUpdated = false;
      const updatedPosts = currentPosts.map(post => {
        if (post.category.toLowerCase() === catToDelete.name.toLowerCase()) {
          postsUpdated = true;
          return {
            ...post,
            category: "Other",
            tagColor: "ink"
          };
        }
        return post;
      });

      if (postsUpdated) {
        fs.writeFileSync(postsFilePath, JSON.stringify(updatedPosts, null, 2), "utf-8");
      }
    }

    revalidatePath("/");
    revalidatePath(`/category/${slug}`);
    revalidatePath("/category/other");

    return { success: true };
  } catch (err: any) {
    console.error("Delete category error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}
