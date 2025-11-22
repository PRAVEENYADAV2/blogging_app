"use client";

export default function Logout() {
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: "inline-block",
        padding: "8px 16px",
        background: "#000",
        color: "#fff",
        borderRadius: "6px",
        textDecoration: "none",
      }}
    >
      Logout
    </button>
  );
}
