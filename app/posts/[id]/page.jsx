import { headers } from "next/headers";

import { notFound } from "next/navigation";
export async function getBaseUrl() {
  const host = headers().get("host");
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

  return (
    <div className="max-w-[1300px] m-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {/* Render HTML content safely */}
      <div
        className="prose prose-lg prose-blue max-w-none prose-pre:bg-gray-900 prose-pre:text-white prose-table:shadow-lg prose-th:bg-gray-100 prose-th:font-bold prose-td:p-3"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
