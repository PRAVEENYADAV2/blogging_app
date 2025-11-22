import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Logout from "@/components/Logout";
import CreatePostForm from "@/components/CreatePostForm";


export default async function AdminPage() {
  const t =await cookies();
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
        <a
          href="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#000",
            textDecoration: "none",
          }}
        >
          Blogify
        </a>

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
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {[
          { title: "Manage Users", desc: "View and control user accounts" },
          { title: "Manage Posts", desc: "Edit or delete blog posts" },
          { title: "Site Settings", desc: "Configure platform options" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
              {item.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#666" }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
