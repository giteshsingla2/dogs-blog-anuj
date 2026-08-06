"use client";

import React from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getLatestPosts } from "@/data/posts";

export default function Footer() {
  const latestPosts = getLatestPosts(4);

  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <h5>Categories</h5>
          <ul className="cat-list">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} style={{ color: "inherit", width: "100%", display: "block" }}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5>Latest Articles</h5>
          <ul className="latest-list">
            {latestPosts.map((post) => (
              <li key={post.slug} className="latest-item">
                <Link href={`/posts/${post.slug}`}>
                  <span className={`tag ${post.tagColor}`}>{post.category}</span>
                  <p>{post.title}</p>
                  <span className="date">{post.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5>Fun Fact</h5>
          <div className="fact-box">
            <p>
              <strong>Did you know?</strong> A dog's nose print is as unique as a human fingerprint — no two are exactly alike, not even littermates.
            </p>
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <div className="footer-brand">
          <div className="b1">🐾 Good Dog Gazette</div>
          <div className="b2">true tails, told straight</div>
        </div>
        <div className="footer-links">
          <a href="#">Advertising</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Submit a Story</a>
        </div>
      </div>
    </footer>
  );
}
