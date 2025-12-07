import PostTable from "@/components/PostTable";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import Logout from "@/components/Logout";
import CreatePostForm from "@/components/CreatePostForm";
import Link from "next/link";
export async function getBaseUrl() {
  const h = await headers(); // MUST await
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

async function getPosts() {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function AdminPage() {
  const { posts } = await getPosts();
  const t = await cookies();
  const token = t.get("token")?.value;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      user = null;
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          fontFamily: "monospace",
          // textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "50px",
          fontSize: "20px",
          height: "90vh",
        }}
      >
        <p>
          Please <a href="/login"> login</a> to access admin panel
        </p>
      </div>
    );
  }

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
          marginBottom: "30px",
        }}
      >
        <Link href="/" style={{textDecoration: "none"}}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#000",
              textDecoration: "none",
            }}
          >
            Blogify{" "}
          </span>
        </Link>

        {user ? (
          <Logout />
        ) : (
          <a
            href="/login"
            style={{
              padding: "8px 16px",
              background: "#000",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
            }}
          >
            Login
          </a>
        )}
      </header>
      {/* Admin Content */}
      <h1
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        Admin Dashboard
      </h1>
      <p style={{ marginBottom: "20px", color: "#444" }}>
        Welcome, <strong>{user.email}</strong> — You have full admin access.
      </p>
      <div style={{ marginBottom: "40px" }}>
        <CreatePostForm />
      </div>
      {/* Admin Sections */}
      {/* Replace your posts.map block with this: */}
      {posts?.length ? <PostTable posts={posts} /> : <p>No posts found</p>}
    </div>
  );
}
