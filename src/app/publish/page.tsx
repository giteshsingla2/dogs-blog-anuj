"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { publishPost } from "./actions";
import DogIllustration from "@/components/DogIllustration";

const categories = [
  "Rescue Stories",
  "Training",
  "Breed Spotlight",
  "Health & Wellness",
  "Funny & Cute",
  "Adventure",
  "Gear",
  "Celebrity Dogs",
  "Senior Dogs",
  "Puppy Life",
  "Other"
];

const gradientPresets = [
  { name: "Rust Red", value: "linear-gradient(135deg, #FF6F59, #C94A38)" },
  { name: "Teal Blue", value: "linear-gradient(135deg, #7C6FF2, #5A4FCF)" },
  { name: "Green Teal", value: "linear-gradient(135deg, #2EC4B6, #1E8B80)" },
  { name: "Gold Orange", value: "linear-gradient(135deg, #FFC145, #E0A324)" },
  { name: "Ink Blue", value: "linear-gradient(135deg, #2E3358, #1F2340)" },
  { name: "Coral Sunset", value: "linear-gradient(135deg, #FFC145, #D65A44)" },
  { name: "Rainbow", value: "linear-gradient(180deg, #3A3470 0%, #FF6F59 55%, #D65A44 100%)" }
];

const illustrationPresets = [
  { id: "hero-dog", name: "Running Dog" },
  { id: "card-senior", name: "Cozy Retriever" },
  { id: "card-adventure", name: "Tripod Hound" },
  { id: "card-training", name: "Smart Collie" },
  { id: "card-rescue", name: "Firehouse Pup" },
  { id: "card-gear", name: "Pulling Husky" },
  { id: "card-corgi", name: "Playful Corgi" },
  { id: "card-puppy", name: "Sleeping Pup" },
  { id: "card-pyrenees", name: "Sheep Guard" }
];

export default function PublishPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Rescue Stories");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0].value);
  const [selectedIllustration, setSelectedIllustration] = useState(illustrationPresets[0].id);
  const [imageUrl, setImageUrl] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  // Slug auto-generation helper
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(slugify(value));
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("Rescue Stories");
    setAuthor("");
    setSummary("");
    setContent("");
    setSelectedGradient(gradientPresets[0].value);
    setSelectedIllustration(illustrationPresets[0].id);
    setImageUrl("");
    setError(null);
    setSuccessSlug(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("summary", summary);
    formData.append("content", content);
    formData.append("gradient", selectedGradient);
    formData.append("artStyleId", selectedIllustration);
    formData.append("imageUrl", imageUrl);

    startTransition(async () => {
      const res = await publishPost(null, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.slug) {
        setSuccessSlug(res.slug);
      }
    });
  };

  if (successSlug) {
    return (
      <div className="publish-wrap">
        <div className="publish-success-card">
          <div className="success-icon">🎉</div>
          <h2 className="publish-title">Article Published Successfully!</h2>
          <p className="publish-subtitle" style={{ marginBottom: "20px" }}>
            Your true tail has been told straight and is now live on the site.
          </p>
          <div className="success-buttons">
            <Link href={`/posts/${successSlug}`} className="ad-btn" style={{ textDecoration: "none", display: "inline-block" }}>
              View Live Article
            </Link>
            <button className="ad-btn" style={{ background: "var(--ink)" }} onClick={resetForm}>
              Publish Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publish-wrap">
      <div className="publish-card">
        <h2 className="publish-title">Tell a True Tail</h2>
        <p className="publish-subtitle">Compose a new story to publish in the Good Dog Gazette.</p>

        {error && (
          <div style={{ padding: "12px", background: "#fdf0ed", border: "1px solid var(--rust)", borderRadius: "6px", color: "#c94a38", fontSize: "14px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Beagle Detects Box of Bacon at Baggage Claim"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. beagle-detects-box-of-bacon"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ""))}
            />
            <span className="form-helper">This is the link path: /posts/{slug || "slug-name"}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. David Vance (Leave blank for Staff)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary *</label>
            <textarea
              required
              rows={2}
              className="form-textarea"
              placeholder="A brief teaser to show in index lists and widgets."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Article Body Content *</label>
            <textarea
              required
              rows={8}
              className="form-textarea"
              placeholder="Tell the story here. You can use standard paragraphs or HTML tags."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <span className="form-helper">Separating lines by double carriage return creates paragraph blocks automatically.</span>
          </div>

          <div className="form-group" style={{ marginTop: "10px" }}>
            <label className="form-label">Featured Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="e.g. https://images.unsplash.com/photo-1543466835-00a7907e9de1"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <span className="form-helper">If provided, this image will fill the featured card/post graphic area instead of the selected presets below.</span>
            {imageUrl && (
              <div style={{ marginTop: "10px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--line)", height: "150px" }}>
                <img
                  src={imageUrl}
                  alt="Featured Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: "10px" }}>
            <label className="form-label">Choose Background Gradient Presets</label>
            <div className="preset-grid">
              {gradientPresets.map(preset => (
                <div
                  key={preset.name}
                  className={`preset-option ${selectedGradient === preset.value ? "selected" : ""}`}
                  onClick={() => setSelectedGradient(preset.value)}
                >
                  <div className="gradient-preview" style={{ background: preset.value }}></div>
                  <span className="preset-label">{preset.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "10px" }}>
            <label className="form-label">Choose Dog Silhouette Illustration</label>
            <div className="preset-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {illustrationPresets.map(preset => (
                <div
                  key={preset.id}
                  className={`preset-option ${selectedIllustration === preset.id ? "selected" : ""}`}
                  onClick={() => setSelectedIllustration(preset.id)}
                >
                  <div className="illustration-preview" style={{ background: "linear-gradient(135deg, #2E3358, #1F2340)" }}>
                    <DogIllustration id={preset.id} width="85%" height="85%" />
                  </div>
                  <span className="preset-label">{preset.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="publish-submit-btn"
            disabled={isPending}
            style={{ marginTop: "24px" }}
          >
            {isPending ? "Publishing story..." : "🐾 Publish Story"}
          </button>

        </form>
      </div>
    </div>
  );
}
