"use client";

import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <main style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Home Base App</h1>
      <AuthForm />
    </main>
  );
}