import React from "react";
import Link from "next/link";
import { posts, getPostBySlug } from "@/data/posts";
import DogIllustration from "@/components/DogIllustration";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";

export default function Home() {
  // Hero Post is the absolute latest article in the array
  const heroPost = posts[0];

  // Most Read Posts (hardcoded list for high-traffic articles)
  const mostReadSlugs = [
    "shelter-dog-nobody-wanted-became-search-and-rescue-hero",
    "why-does-your-dog-sigh-like-that-vets-explain-what-it-really-means",
    "blind-senior-dog-has-guide-dog-of-his-own-both-rescues"
  ];
  const mostReadPosts = mostReadSlugs
    .map(slug => getPostBySlug(slug))
    .filter((p): p is typeof posts[0] => !!p);

  // Just In Posts are the latest 5 posts in the database
  const justInPosts = posts.slice(0, 5);

  // Grid Posts are the next 9 latest posts (excluding the hero post so it is not duplicated)
  const gridPosts = posts
    .filter(p => p.slug !== heroPost?.slug)
    .slice(0, 9);

  // Category Strip Posts
  const stripSlugs = [
    { slug: "rescue-beagle-who-works-tsa-loves-every-minute", color: "var(--rust)" },
    { slug: "do-dogs-actually-feel-guilty-new-research-says-not", color: "var(--teal)" },
    { slug: "why-no-doesnt-work-trainers-case-for-redirection", color: "var(--green)" },
    { slug: "woman-comes-home-finds-dog-rearranged-living-room", color: "var(--gold-deep)" }
  ];
  const stripPosts = stripSlugs
    .map(item => {
      const p = getPostBySlug(item.slug);
      return p ? { ...p, dotColor: item.color } : null;
    })
    .filter((p): p is typeof posts[0] & { dotColor: string } => !!p);

  return (
    <main>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="wrap hero-grid">
          {heroPost && (
            <Link
              href={`/posts/${heroPost.slug}`}
              className="hero-card"
              style={{
                background: heroPost.imageUrl ? "none" : undefined
              }}
            >
              <div className="hero-illustration">
                {heroPost.imageUrl ? (
                  <img src={heroPost.imageUrl} alt={heroPost.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <DogIllustration id={heroPost.artStyleId || "hero-dog"} width="100%" height="100%" />
                )}
              </div>
              <div className="hero-overlay">
                <span className={`tag ${heroPost.tagColor}`}>{heroPost.category}</span>
                <h2>{heroPost.title}</h2>
                <span className="date">{heroPost.date}</span>
              </div>
            </Link>
          )}

          <div className="most-read">
            <h3>Most Read</h3>
            {mostReadPosts.map((post, idx) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="mr-item">
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
        </div>

        <div className="leash wrap">
          <svg viewBox="0 0 1180 22" preserveAspectRatio="none">
            <path
              d="M0,11 Q 60,0 120,11 T 240,11 T 360,11 T 480,11 T 600,11 T 720,11 T 840,11 T 960,11 T 1080,11 T 1200,11"
              stroke="#FF6F59"
              strokeWidth="2"
              fill="none"
              strokeDasharray="1 10"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {/* ===== MAIN GRID SECTION ===== */}
      <section className="main-section">
        <div className="wrap main-grid">
          <div className="card-grid">
            {/* Render first 3 cards */}
            {gridPosts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}

            {/* In-Feed Advertisement Slot between card rows */}
            <div style={{ gridColumn: "1 / -1" }}>
              <AdSlot placement="in-feed" adId="infeed-ad-1" />
            </div>

            {/* Render next 3 cards */}
            {gridPosts.slice(3, 6).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}

            {/* Another optional mid-feed ad or content spacer */}
            <div style={{ gridColumn: "1 / -1" }}>
              <AdSlot placement="in-feed" adId="infeed-ad-2" />
            </div>

            {/* Render last 3 cards */}
            {gridPosts.slice(6, 9).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Sidebar (Most Read / Ads / Just In) */}
          <Sidebar mostReadPosts={mostReadPosts} justInPosts={justInPosts} />
        </div>

        {/* ===== CATEGORY STRIP ===== */}
        <div className="wrap cat-strip">
          <div className="cat-strip-grid">
            {stripPosts.map((post) => (
              <div className="cat-box" key={post.slug}>
                <h4>
                  <span className="dot" style={{ background: post.dotColor }}></span>
                  {post.category}
                </h4>
                <Link
                  href={`/posts/${post.slug}`}
                  className="art"
                  style={{
                    background: post.imageUrl ? "none" : (post.gradient || "var(--ink)"),
                    display: "block",
                    overflow: "hidden"
                  }}
                >
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    post.artStyleId && (
                      <DogIllustration id={post.artStyleId} width="100%" height="100%" />
                    )
                  )}
                </Link>
                <p className="title">{post.title}</p>
                <Link className="read-more" href={`/posts/${post.slug}`}>
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
