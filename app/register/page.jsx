"use client";
import { useState } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Registration successful!");
            } else {
                setMessage(`❌ Error: ${data.message || "Something went wrong"}`);
            }
        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    return (
        <div
            style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "Arial" }}
        >
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                />

                <button
                    type="submit"
                    style={{
                        padding: "10px 15px",
                        background: "blue",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "10px",
                    }}
                >
                    Register
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
}
