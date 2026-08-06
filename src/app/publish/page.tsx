import React from "react";
import fs from "fs";
import path from "path";
import PublishDashboard from "./PublishDashboard";
import { Post } from "@/data/posts";
import { Category } from "@/data/categories";

// Force Server Side Rendering to fetch live JSON modifications without build-time caching
export const dynamic = "force-dynamic";

function getPosts(): Post[] {
  const filePath = path.join(process.cwd(), "src", "data", "posts.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

function getCategories(): Category[] {
  const filePath = path.join(process.cwd(), "src", "data", "categories.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

export default function PublishPage() {
  const posts = getPosts();
  const categories = getCategories();

  return (
    <PublishDashboard initialPosts={posts} initialCategories={categories} />
  );
}
