"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/data/posts";
import { Category } from "@/data/categories";
import DogIllustration from "@/components/DogIllustration";
import {
  publishPost,
  updatePost,
  deletePost,
  addCategory,
  deleteCategory
} from "./actions";

interface PublishDashboardProps {
  initialPosts: Post[];
  initialCategories: Category[];
}

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

export default function PublishDashboard({ initialPosts, initialCategories }: PublishDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"compose" | "manage-posts" | "manage-categories">("compose");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(initialCategories[0]?.name || "Other");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(gradientPresets[0].value);
  const [selectedIllustration, setSelectedIllustration] = useState(illustrationPresets[0].id);
  const [imageUrl, setImageUrl] = useState("");

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  // Category State
  const [newCatName, setNewCatName] = useState("");

  // Transitions & Messaging
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Slugifier helper
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    // Don't auto-overwrite slug if we are editing an established slug
    if (!isEditing) {
      setSlug(slugify(value));
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory(initialCategories[0]?.name || "Other");
    setAuthor("");
    setSummary("");
    setContent("");
    setSelectedGradient(gradientPresets[0].value);
    setSelectedIllustration(illustrationPresets[0].id);
    setImageUrl("");
    setError(null);
    setSuccessSlug(null);
    setIsEditing(false);
    setOriginalSlug("");
  };

  // Submit Handler: Supports both CREATE (publishPost) and UPDATE (updatePost)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessSlug(null);
    setSuccessMsg(null);

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
      let res;
      if (isEditing) {
        res = await updatePost(originalSlug, formData);
      } else {
        res = await publishPost(null, formData);
      }

      if (res.error) {
        setError(res.error);
      } else if (res.success && res.slug) {
        setSuccessSlug(res.slug);
        setIsEditing(false);
        setOriginalSlug("");
        router.refresh(); // Refresh page queries to reflect edits
      }
    });
  };

  // Edit Action: Pull story into composer form
  const startEdit = (post: Post) => {
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setAuthor(post.author || "");
    setSummary(post.summary);
    // Remove p tags to make it normal markdown/plain text for editing
    const plainContent = post.contentHtml
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .trim();
    setContent(plainContent);
    setSelectedGradient(post.gradient || gradientPresets[0].value);
    setSelectedIllustration(post.artStyleId || illustrationPresets[0].id);
    setImageUrl(post.imageUrl || "");
    
    setIsEditing(true);
    setOriginalSlug(post.slug);
    setError(null);
    setSuccessSlug(null);
    setActiveTab("compose");
  };

  // Delete Action: Remove Story
  const handleDeletePost = async (slugToDelete: string) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    
    startTransition(async () => {
      const res = await deletePost(slugToDelete);
      if (res.error) {
        alert(res.error);
      } else {
        setSuccessMsg("Story deleted successfully!");
        router.refresh();
      }
    });
  };

  // Category Actions: Add
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!newCatName.trim()) return;

    startTransition(async () => {
      const res = await addCategory(newCatName);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Category "${newCatName}" created successfully!`);
        setNewCatName("");
        router.refresh();
      }
    });
  };

  // Category Actions: Delete
  const handleDeleteCategory = async (catSlug: string) => {
    if (!confirm("Are you sure you want to delete this category? Any stories inside will fall back to the 'Other' category.")) return;

    startTransition(async () => {
      const res = await deleteCategory(catSlug);
      if (res.error) {
        alert(res.error);
      } else {
        setSuccessMsg("Category deleted successfully!");
        router.refresh();
      }
    });
  };

  if (successSlug) {
    return (
      <div className="publish-wrap">
        <div className="publish-success-card">
          <div className="success-icon">🎉</div>
          <h2 className="publish-title">Article {isEditing ? "Updated" : "Published"} Successfully!</h2>
          <p className="publish-subtitle" style={{ marginBottom: "20px" }}>
            Your true tail is compiled and live on the Good Dog Gazette.
          </p>
          <div className="success-buttons">
            <Link href={`/posts/${successSlug}`} className="ad-btn" style={{ textDecoration: "none", display: "inline-block" }}>
              View Live Article
            </Link>
            <button className="ad-btn" style={{ background: "var(--ink)" }} onClick={resetForm}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="publish-wrap" style={{ maxWidth: activeTab === "manage-posts" ? "1050px" : "800px", margin: "0 auto", padding: "20px 16px" }}>
      
      {/* Tab bar header */}
      <div className="publish-tabs">
        <button
          className={`publish-tab ${activeTab === "compose" ? "active" : ""}`}
          onClick={() => setActiveTab("compose")}
        >
          {isEditing ? "✏️ Edit Story" : "✍️ Compose Story"}
        </button>
        <button
          className={`publish-tab ${activeTab === "manage-posts" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("manage-posts");
            setError(null);
            setSuccessMsg(null);
          }}
        >
          📚 Manage Stories ({initialPosts.length})
        </button>
        <button
          className={`publish-tab ${activeTab === "manage-categories" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("manage-categories");
            setError(null);
            setSuccessMsg(null);
          }}
        >
          🏷️ Manage Categories ({initialCategories.length})
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: "12px", background: "#ecfdf5", border: "1px solid var(--green)", borderRadius: "6px", color: "#065f46", fontSize: "14px", marginBottom: "20px" }}>
          ✅ {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: "12px", background: "#fdf0ed", border: "1px solid var(--rust)", borderRadius: "6px", color: "#c94a38", fontSize: "14px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ==================== TAB 1: COMPOSE / EDIT STORY ==================== */}
      {activeTab === "compose" && (
        <div className="publish-card">
          <h2 className="publish-title">{isEditing ? "Edit Story" : "Tell a True Tail"}</h2>
          <p className="publish-subtitle">
            {isEditing ? `Modifying: ${title}` : "Compose a new story to publish in the Good Dog Gazette."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            
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
              <span className="form-helper">Link path: /posts/{slug || "slug-name"}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {initialCategories.map(cat => (
                    <option key={cat.slug} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. David Vance"
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
                placeholder="Tell the story here. Use standard double returns to separate paragraphs."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <span className="form-helper">Paragraph blocks will be created automatically.</span>
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
              <span className="form-helper">Overrides presets below if provided.</span>
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

            <div className="action-btn-group" style={{ marginTop: "24px", justifyContent: "flex-end" }}>
              {isEditing && (
                <button
                  type="button"
                  className="action-btn"
                  onClick={resetForm}
                  style={{ background: "#fcfaf9", color: "var(--ink-soft)" }}
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="publish-submit-btn"
                disabled={isPending}
                style={{ margin: 0 }}
              >
                {isPending ? "Processing..." : isEditing ? "🐾 Update Story" : "🐾 Publish Story"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ==================== TAB 2: MANAGE STORIES ==================== */}
      {activeTab === "manage-posts" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="publish-title" style={{ margin: 0 }}>Manage Stories</h2>
            <button className="ad-btn" style={{ padding: "8px 16px" }} onClick={() => setActiveTab("compose")}>
              + Write New
            </button>
          </div>
          
          <div className="manage-table-wrap">
            <table className="manage-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialPosts.length > 0 ? (
                  initialPosts.map((post) => (
                    <tr key={post.slug}>
                      <td style={{ fontWeight: 600, color: "var(--ink)" }}>{post.title}</td>
                      <td>{post.category}</td>
                      <td style={{ fontSize: "13px" }}>{post.date}</td>
                      <td>
                        <div className="action-btn-group">
                          <button
                            className="action-btn edit"
                            onClick={() => startEdit(post)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            disabled={isPending}
                            onClick={() => handleDeletePost(post.slug)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--ink-soft)" }}>
                      No stories found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MANAGE CATEGORIES ==================== */}
      {activeTab === "manage-categories" && (
        <div>
          <h2 className="publish-title">Manage Categories</h2>
          <p className="publish-subtitle">Add or remove custom categories in the Good Dog Gazette.</p>

          <div className="cat-manage-grid">
            
            {/* Left Column: Categories List */}
            <div className="cat-list-box">
              <h3 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                Active Categories
              </h3>
              <div>
                {initialCategories.map((cat) => (
                  <div className="cat-list-item" key={cat.slug}>
                    <span className="cat-badge">
                      <span className="dot" style={{ background: cat.color }}></span>
                      {cat.name}
                    </span>
                    
                    {cat.slug !== "other" ? (
                      <button
                        className="action-btn delete"
                        disabled={isPending}
                        onClick={() => handleDeleteCategory(cat.slug)}
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                      >
                        Delete
                      </button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#aaa", fontStyle: "italic" }}>System</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Add Category Form */}
            <div className="cat-list-box" style={{ alignSelf: "start" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                Create New Category
              </h3>
              
              <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Smart Tricks"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="publish-submit-btn"
                  disabled={isPending}
                  style={{ width: "100%", margin: 0, padding: "12px" }}
                >
                  {isPending ? "Adding..." : "🐾 Create Category"}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
