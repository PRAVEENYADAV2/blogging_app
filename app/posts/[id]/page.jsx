import { headers } from "next/headers";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Logout from "@/components/Logout";
import { notFound } from "next/navigation";
import CodeEnhancer from "@/components/CodeEnhancer";
import "../../globals.css";
export async function getBaseUrl() {
  const h = await headers(); // MUST await
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

async function getPost(id) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }) {
  const param = await params;
  const post = await getPost(param.id);
  if (!post) return notFound();
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
  return (
    <div
      className="max-w-[1300px] m-auto p-6"
      style={{ fontFamily: "monospace" }}
    >
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
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {/* Render HTML content safely */}
      <CodeEnhancer>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CodeEnhancer>
    </div>
  );
}
