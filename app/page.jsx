import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
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
          <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </nav>
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
        <div className="grid grid-cols-3 gap-[10px]">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id}>
                <img
                  src="https://www.chitkara.edu.in/blogs/wp-content/uploads/2023/09/Blogging-in-Digital-Marketing.jpg"
                  alt={post.title}
                  width={400}
                  height={200}
                />
                <h4>{post.title}</h4>
                {/* Show only first 100 chars */}
                <p>{post.content.slice(0, 100)}...</p>
                <a href={`/posts/${post._id}`}>Read More</a>
              </article>
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
