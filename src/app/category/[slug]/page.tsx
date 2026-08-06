import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, getPostBySlug, posts } from "@/data/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Map slug back to category name and tag styles
const categoryMap: Record<string, { name: string; color: string }> = {
  "rescue-stories": { name: "Rescue Stories", color: "var(--rust)" },
  "training": { name: "Training", color: "var(--gold-deep)" },
  "breed-spotlight": { name: "Breed Spotlight", color: "var(--teal)" },
  "health-and-wellness": { name: "Health & Wellness", color: "var(--teal)" },
  "funny-and-cute": { name: "Funny & Cute", color: "var(--gold-deep)" },
  "adventure": { name: "Adventure", color: "var(--green)" },
  "gear": { name: "Gear", color: "var(--ink-soft)" },
  "celebrity-dogs": { name: "Celebrity Dogs", color: "var(--ink-soft)" },
  "senior-dogs": { name: "Senior Dogs", color: "var(--teal)" },
  "puppy-life": { name: "Puppy Life", color: "var(--green)" },
  "other": { name: "Other", color: "var(--ink-soft)" }
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryInfo = categoryMap[slug];

  if (!categoryInfo) {
    notFound();
  }

  const categoryPosts = getPostsByCategory(categoryInfo.name);

  // Get data for the sidebar
  const mostReadSlugs = [
    "shelter-dog-nobody-wanted-became-search-and-rescue-hero",
    "why-does-your-dog-sigh-like-that-vets-explain-what-it-really-means",
    "blind-senior-dog-has-guide-dog-of-his-own-both-rescues"
  ];
  const mostReadPosts = mostReadSlugs
    .map(s => getPostBySlug(s))
    .filter((p): p is typeof posts[0] => !!p);

  const justInSlugs = [
    "fostered-unadoptable-one-six-years-finally-found-home",
    "meet-great-pyrenees-who-guards-entire-flock-of-sheep-solo",
    "seven-signs-your-dog-is-secretly-a-genius"
  ];
  const justInPosts = justInSlugs
    .map(s => getPostBySlug(s))
    .filter((p): p is typeof posts[0] => !!p);

  return (
    <main className="wrap">
      <header className="category-header">
        <h1>
          <span className="dot" style={{ background: categoryInfo.color }}></span>
          {categoryInfo.name}
        </h1>
      </header>

      <div className="category-grid">
        
        {/* Main Feed */}
        <div>
          {categoryPosts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="card-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                {categoryPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
              
              <AdSlot placement="in-feed" adId="category-bottom-ad" />
            </div>
          ) : (
            <div style={{ padding: "40px 0", textAlign: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: "6px" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "12px", fontFamily: "var(--font-fraunces), serif" }}>No Stories Yet</h2>
              <p style={{ color: "var(--ink-soft)", maxWidth: "400px", margin: "0 auto 20px" }}>
                We don't have any stories published in <strong>{categoryInfo.name}</strong> yet. We are working hard to write some true tails for you!
              </p>
              <Link href="/" className="ad-btn" style={{ display: "inline-block", textDecoration: "none" }}>
                Go Back Home
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar mostReadPosts={mostReadPosts} justInPosts={justInPosts} showAd={true} />

      </div>
    </main>
  );
}
export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({
    slug,
  }));
}
