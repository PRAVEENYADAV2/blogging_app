"use client";
import { useState } from "react";

export default function EditPostForm({ post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags.join(", "));

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`/api/posts/${post._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map((t) => t.trim()),
      }),
    });

    if (res.ok) {
      alert("Updated Successfully!");
      window.location.href = "/admin"; // redirect back
    } else {
      alert("Failed to update");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
        style={inputStyle}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="8"
        required
        style={inputStyle}
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Comma separated tags"
        style={inputStyle}
      />

      <button
        type="submit"
        style={{
          background: "black",
          color: "white",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Update Post
      </button>
    </form>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
