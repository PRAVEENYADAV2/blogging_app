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
      className="bg-red-500 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}
