import { cookies } from "next/headers";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import Logout from "@/components/Logout";

export async function getBaseUrl() {
  const host = headers().get("host");
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
    <div className="max-w-[1300px] m-auto">
      {/* Header */}
      <header>
        <div>
          <h1>Blogify</h1>
          <nav>{user ? <Logout></Logout> : <a href="/login">Login</a>}</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section>
        <h2>Welcome to Blogify</h2>
        <p>Your go-to place for insightful articles and stories.</p>
        {user ? (
          <p className="text-green-600 font-semibold">
            Logged in as {user.email}, Role: {user.role}
          </p>
        ) : (
          <p className="text-red-500 font-semibold">Not logged in</p>
        )}
      </section>

      {/* Latest Posts */}
      <main>
        <h3>Latest Posts</h3>
        <div className="grid grid-cols-4  gap-[10px]">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <a href={`/posts/${post._id}`} className="text-balck">
                <article key={post._id} className="border">
                  <h4>{post.title}</h4>
                  {/* Show only first 100 chars */}
                  <a href={`/posts/${post._id}`}>Read More</a>
                </article>
              </a>
            ))
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </main>

      <footer>
        <p>© 2025 Blogify. All rights reserved.</p>
      </footer>
    </div>
  );
}
