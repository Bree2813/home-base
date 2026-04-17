"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link 💌");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Sign Up</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: 10, width: "100%" }}
      >
        {loading ? "Sending..." : "Send Magic Link"}
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}