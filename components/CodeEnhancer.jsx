"use client";
import { useEffect } from "react";

export default function CodeEnhancer({ children }) {
  useEffect(() => {
    const pres = document.querySelectorAll("pre");

    pres.forEach((pre) => {
      // Avoid duplicate buttons
      if (pre.querySelector(".copy-btn")) return;

      const button = document.createElement("button");
      button.innerText = "Copy";
      button.className = "copy-btn";

      Object.assign(button.style, {
        position: "absolute",
        top: "8px",
        right: "8px",
        padding: "6px 10px",
        fontSize: "12px",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      });

      button.onclick = () => {
        const code = pre.querySelector("code");
        if (!code) return;
        navigator.clipboard.writeText(code.innerText.trim());
        button.innerText = "Copied!";
        setTimeout(() => (button.innerText = "Copy"), 2000);
      };

      pre.style.position = "relative";
      pre.appendChild(button);
    });
  }, []);

  return children;
}
