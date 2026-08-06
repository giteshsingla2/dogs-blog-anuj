import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory, posts } from "@/data/posts";
import DogIllustration from "@/components/DogIllustration";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import PostCard from "@/components/PostCard";
import ShareButtons from "@/components/ShareButtons";

interface PostPageProps {
  params: Promise<{ slug: string[] }>;
}

// Split content into pages based on word counts per top-level paragraph element
function splitContentIntoPages(contentHtml: string, targetWords = 120, roundOffThreshold = 60): string[] {
  // Normalize consecutive <br/> tags (e.g., <br/><br/>, <br/>\r<br/>) into paragraph breaks </p><p>
  // to ensure posts formatted in single large paragraphs are split correctly.
  let normalizedHtml = contentHtml
    .replace(/<br\s*\/?>(\s*[\r\n]*\s*<br\s*\/?>)+/gi, "</p>\n<p>")
    .replace(/<p>\s*<\/p>/gi, ""); // Clean up any empty paragraphs

  const elements = normalizedHtml.match(/<p>[\s\S]*?<\/p>|<blockquote>[\s\S]*?<\/blockquote>|<h3>[\s\S]*?<\/h3>|<ol>[\s\S]*?<\/ol>|<ul>[\s\S]*?<\/ul>|<div.*?>[\s\S]*?<\/div>/g) || [normalizedHtml];

  const pages: string[] = [];
  let currentPageElements: string[] = [];
  let currentPageWordCount = 0;

  const countWords = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ");
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const wordCount = countWords(el);

    currentPageElements.push(el);
    currentPageWordCount += wordCount;

    if (currentPageWordCount >= targetWords) {
      // Lookahead check for remaining elements
      let remainingWords = 0;
      for (let j = i + 1; j < elements.length; j++) {
        remainingWords += countWords(elements[j]);
      }

      // Round-off if remaining words are below threshold
      if (remainingWords <= roundOffThreshold) {
        for (let j = i + 1; j < elements.length; j++) {
          currentPageElements.push(elements[j]);
        }
        pages.push(currentPageElements.join("\n"));
        currentPageElements = [];
        break;
      } else {
        pages.push(currentPageElements.join("\n"));
        currentPageElements = [];
        currentPageWordCount = 0;
      }
    }
  }

  if (currentPageElements.length > 0) {
    pages.push(currentPageElements.join("\n"));
  }

  return pages;
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;

  if (!slugArray || slugArray.length < 1 || slugArray.length > 2) {
    notFound();
  }

  const postSlug = slugArray[0];
  const pageNumStr = slugArray[1] || "1";
  const pageNum = parseInt(pageNumStr, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const post = getPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  // Segment HTML body into pages
  const pages = splitContentIntoPages(post.contentHtml);
  if (pageNum > pages.length) {
    notFound();
  }

  const activePageContent = pages[pageNum - 1];
  const hasNextPage = pageNum < pages.length;
  const hasPrevPage = pageNum > 1;

  // Get related articles (same category, excluding current post)
  const relatedPosts = getPostsByCategory(post.category)
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  if (relatedPosts.length < 3) {
    const additional = posts
      .filter(p => p.slug !== post.slug && !relatedPosts.some(r => r.slug === p.slug))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  // Get sidebar feeds
  const mostReadSlugs = [
    "shelter-dog-nobody-wanted-became-search-and-rescue-hero",
    "why-does-your-dog-sigh-like-that-vets-explain-what-it-really-means",
    "blind-senior-dog-has-guide-dog-of-his-own-both-rescues"
  ];
  const mostReadPosts = mostReadSlugs
    .map(slug => getPostBySlug(slug))
    .filter((p): p is typeof posts[0] => !!p);

  const justInPosts = posts.slice(0, 5);

  return (
    <main className="wrap">
      <div className="post-layout-focused">
        <article>
          <header className="post-header">
            <Link href={`/category/${post.category.toLowerCase().replace(/ & /g, "-and-").replace(/ /g, "-")}`}>
              <span className={`tag ${post.tagColor}`}>{post.category}</span>
            </Link>
            <h1>{post.title}</h1>
            <div className="post-meta-box" style={{ borderLeftColor: `var(--${post.tagColor})` }}>
              <span>👤 By <strong>{post.author || "Good Dog Staff"}</strong></span>
              <span>📅 {post.date}</span>
              <span>⏱️ {post.readTime || "3 min read"}</span>
            </div>
          </header>

          {/* Illustration Graphic or Image */}
          <div
            className="post-art-hero"
            style={{
              background: post.imageUrl ? "none" : (post.gradient || "linear-gradient(180deg, #3A3470 0%, #FF6F59 55%, #D65A44 100%)"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              post.artStyleId && (
                <DogIllustration id={post.artStyleId} width="80%" height="80%" />
              )
            )}
          </div>

          {/* Render Current Page Content */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: activePageContent }}
          />

          {/* Pagination Controls & Ad Placement */}
          <div className="pager-container">
            {pages.length > 1 && (
              <span className="pager-info">Page {pageNum} of {pages.length}</span>
            )}

            {/* Ad placement above Next button */}
            <AdSlot placement="mid-content" adId="post-mid-ad" />

            {hasNextPage && (
              <Link href={`/posts/${post.slug}/${pageNum + 1}`} className="pager-next-btn" style={{ textDecoration: "none" }}>
                Next →
              </Link>
            )}

            {hasPrevPage && (
              <div>
                <Link href={`/posts/${post.slug}${pageNum === 2 ? "" : `/${pageNum - 1}`}`} className="pager-prev-link">
                  ← Previous Page
                </Link>
              </div>
            )}
          </div>

          {pageNum === pages.length && (
            <div className="post-content" style={{ marginTop: "20px" }}>
              <p>For more heartwarming and informative dog stories, tips on training, and expert advice, be sure to bookmark the Good Dog Gazette and subscribe to our weekly newsletter.</p>
            </div>
          )}

          {/* Social Share Buttons */}
          <ShareButtons />
        </article>

        {/* Related Articles Strip */}
        <section className="related-section">
          <h3>Stories you might love</h3>
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {relatedPosts.map(p => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

// Generate static params for prerendering catch-all pages
export async function generateStaticParams() {
  const paramsList: { slug: string[] }[] = [];

  for (const post of posts) {
    const pages = splitContentIntoPages(post.contentHtml);
    const pagesCount = pages.length;

    // Prerender first page (without pagination sub-segment)
    paramsList.push({ slug: [post.slug] });

    // Prerender numbered dynamic routes
    for (let p = 1; p <= pagesCount; p++) {
      paramsList.push({ slug: [post.slug, String(p)] });
    }
  }

  return paramsList;
}
