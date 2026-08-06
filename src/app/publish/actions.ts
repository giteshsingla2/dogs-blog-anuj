"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { Post } from "@/data/posts";

const categoryColors: Record<string, 'rust' | 'green' | 'gold' | 'teal' | 'ink'> = {
  "Rescue Stories": "rust",
  "Training": "gold",
  "Breed Spotlight": "teal",
  "Health & Wellness": "teal",
  "Funny & Cute": "gold",
  "Adventure": "green",
  "Gear": "ink",
  "Celebrity Dogs": "ink",
  "Senior Dogs": "teal",
  "Puppy Life": "green",
  "Other": "ink"
};

const categorySlugs: Record<string, string> = {
  "Rescue Stories": "rescue-stories",
  "Training": "training",
  "Breed Spotlight": "breed-spotlight",
  "Health & Wellness": "health-and-wellness",
  "Funny & Cute": "funny-and-cute",
  "Adventure": "adventure",
  "Gear": "gear",
  "Celebrity Dogs": "celebrity-dogs",
  "Senior Dogs": "senior-dogs",
  "Puppy Life": "puppy-life",
  "Other": "other"
};

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

    // Clean slug input
    const slug = slugInput
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      return { error: "Invalid slug name." };
    }

    // Read existing database
    const filePath = path.join(process.cwd(), "src", "data", "posts.json");
    
    let currentPosts: Post[] = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      currentPosts = JSON.parse(fileData);
    }

    // Check duplicate slug
    const duplicate = currentPosts.some(p => p.slug === slug);
    if (duplicate) {
      return { error: `An article with slug "${slug}" already exists. Please choose a different slug.` };
    }

    // Calculate dynamic values
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    
    // Formatted date (e.g. "5 August, 2026")
    const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date().toLocaleDateString("en-US", dateOptions);

    const tagColor = categoryColors[category] || "ink";

    // Format contentHtml
    // Simple conversion of newlines to paragraphs if the user didn't enter HTML
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

    // Append and write file
    currentPosts.unshift(newPost); // Add to the top of the list so it appears as latest
    fs.writeFileSync(filePath, JSON.stringify(currentPosts, null, 2), "utf-8");

    // Revalidate paths to clear static page caches
    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    
    const catSlug = categorySlugs[category];
    if (catSlug) {
      revalidatePath(`/category/${catSlug}`);
    }

    return { success: true, slug };
  } catch (err: any) {
    console.error("Publishing error: ", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}
