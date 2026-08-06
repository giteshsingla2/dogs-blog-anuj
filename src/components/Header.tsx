"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdSlot from "./AdSlot";

import { categories } from "@/data/categories";

export default function Header() {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/");

  return (
    <header>
      <div className="wrap top-row">
        <Link href="/" className="logo">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="6" r="2.7" fill="#FF6F59" />
            <circle cx="12" cy="4" r="2.7" fill="#FF6F59" />
            <circle cx="18" cy="6" r="2.7" fill="#FF6F59" />
            <ellipse cx="12" cy="14.5" rx="7" ry="6.4" fill="#FF6F59" />
          </svg>
          <div>
            <h1>Good Dog Gazette</h1>
            <div className="sub">true tails, told straight</div>
          </div>
        </Link>

        {/* Ad slot in header */}
        <div style={{ maxWidth: "500px", width: "100%", height: "70px", overflow: "hidden" }}>
          <AdSlot placement="header" adId="header-ad" />
        </div>
      </div>
      {!isPostPage && (
        <nav>
          <div className="wrap">
            <ul>
              {categories.map((cat) => {
                const href = `/category/${cat.slug}`;
                const isActive = pathname === href;
                return (
                  <li key={cat.slug}>
                    <Link href={href} className={isActive ? "active" : ""}>
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
