import React from "react";
import Link from "next/link";
import { Post } from "@/data/posts";
import DogIllustration from "./DogIllustration";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="card">
      <div
        className="card-art"
        style={{
          background: post.imageUrl ? "none" : (post.gradient || "linear-gradient(135deg, var(--gold), var(--rust))")
        }}
      >
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          post.artStyleId && (
            <DogIllustration id={post.artStyleId} width="100%" height="100%" />
          )
        )}
      </div>
      <div className="card-body">
        <span className={`tag ${post.tagColor}`}>{post.category}</span>
        <h3>{post.title}</h3>
        <span className="date">{post.date}</span>
      </div>
    </Link>
  );
}
