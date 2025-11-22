import EditPostForm from "@/components/EditPostForm";
import { headers } from "next/headers";
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

  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export default async function EditPage({ params }) {
  const post = await getPost(params.id);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily:"monospace" }}>
      <h1>Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  );
}
