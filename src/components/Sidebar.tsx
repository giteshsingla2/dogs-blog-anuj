import React from "react";
import Link from "next/link";
import { Post } from "@/data/posts";
import AdSlot from "./AdSlot";

interface SidebarProps {
  mostReadPosts: Post[];
  justInPosts: Post[];
  showAd?: boolean;
}

export function MostReadSidebar({ posts }: { posts: Post[] }) {
  return (
    <div className="most-read">
      <h3>Most Read</h3>
      {posts.map((post, idx) => (
        <Link key={post.slug} href={`/posts/${post.slug}`} className="mr-item" style={{ display: "flex", textDecoration: "none", color: "inherit" }}>
          <div className="mr-thumb" style={{ background: post.gradient || "linear-gradient(135deg, var(--gold), var(--rust))" }}>
            {idx + 1}
          </div>
          <div>
            <p>{post.title}</p>
            <span className="date">{post.date}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function JustInSidebar({ posts }: { posts: Post[] }) {
  return (
    <aside className="just-in">
      <span className="eyebrow">Just In</span>
      {posts.map((post) => (
        <div key={post.slug} className="ji-item">
          <Link href={`/posts/${post.slug}`}>
            <span className={`tag ${post.tagColor}`}>{post.category}</span>
            <h4>{post.title}</h4>
            <span className="date">{post.date}</span>
          </Link>
        </div>
      ))}
    </aside>
  );
}

export default function Sidebar({ mostReadPosts, justInPosts, showAd = true }: SidebarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <MostReadSidebar posts={mostReadPosts} />
      
      {showAd && (
        <AdSlot placement="sidebar" adId="sidebar-ad-widget" />
      )}

      <JustInSidebar posts={justInPosts} />
    </div>
  );
}
