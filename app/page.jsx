import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Logout from "@/components/Logout";

import { headers } from "next/headers";

export async function getBaseUrl() {
  const h = await headers(); // MUST await
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}
function formatDate(date) {
  const d = new Date(date);

  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const month = d.toLocaleString("en-US", { month: "short" }); // Feb
  const year = d.getFullYear();
  const time = d.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${suffix} ${month} ${year} ${time}`;
}


async function getPosts() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const { posts } = await getPosts();

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "#000",
          }}
        >
          Blogify
        </a>

        <nav>
          {user ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <Logout />
              <a
                href="/admin"
                style={{
                  display: "inline-block",
                  padding: "9.5px 16px",
                  background: "#000",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                }}
              >
                Admin
              </a>{" "}
            </div>
          ) : (
            <a
              href="/login"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "#000",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Login
            </a>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: "center", margin: "60px 0" }}>
        <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Welcome to Blogify
        </h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Your go-to place for insightful articles and stories.
        </p>

        {user ? (
          <p style={{ color: "green", fontWeight: "500" }}>
            Logged in as {user.email} • Role: {user.role}
          </p>
        ) : (
          <p style={{ color: "red", fontWeight: "500" }}>Not logged in</p>
        )}
      </section>

      {/* Latest Posts */}
      <main style={{ margin: "50px 0" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>Latest Posts</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {posts?.length ? (
            posts.map((post) => (
              <a
                key={post._id}
                href={`/posts/${post._id}`}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  textDecoration: "none",
                  color: "#000",
                  backgroundColor: "#EEF5DB",
                  transition: "background 0.2s",
                }}
              >
                <h4 style={{ fontWeight: "300", fontSize: "20px" }}>
                  {post.title}
                </h4>
                {formatDate(post.createdAt)}
              </a>
            ))
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "60px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          color: "#888",
        }}
      >
        © 2025 Blogify. All rights reserved.
      </footer>
    </div>
  );
}
