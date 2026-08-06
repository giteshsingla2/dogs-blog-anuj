"use client";

import React from "react";

export default function ShareButtons() {
  const handleShare = (platform: string) => {
    if (platform === "link") {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      alert(`Shared to ${platform}!`);
    }
  };

  return (
    <div className="post-share">
      <span>Share this Story:</span>
      <button className="share-btn" onClick={() => handleShare("Twitter")}>Twitter</button>
      <button className="share-btn" onClick={() => handleShare("Facebook")}>Facebook</button>
      <button className="share-btn" onClick={() => handleShare("Pinterest")}>Pinterest</button>
      <button className="share-btn" onClick={() => handleShare("link")}>Copy Link</button>
    </div>
  );
}
