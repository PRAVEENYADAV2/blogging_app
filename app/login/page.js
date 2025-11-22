"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        // No need to store token manually, it's set as HttpOnly cookie
        router.push("/"); // Redirect to homepage
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "95dvh",
        background: "#f5f5f5",
        fontFamily: "monospace",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "320px",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "calc(100% - 21px)",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "12px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "calc(100% - 21px)",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "18px",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "15px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Login
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              fontSize: "13px",
              color: "#333",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );

}
