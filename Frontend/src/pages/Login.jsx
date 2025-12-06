import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) return setErr(json?.error || "Login Failed");
      //save token
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      nav("/");
    } catch (error) {
      console.error(error);
      setErr("Network Error");
    }
  }
  return (
    <div className="min-h-screen flex items-center bg-linear-to-b from-[#07101a] via-[#081324] to-[#06111a] justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">Sign In</h2>
        {err && <div className="mb-3 text-sm text-red-400">{err}</div>}
        <form onSubmit={handleLogin} className="space-y-4 text-white">
          <input
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/10"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-white/10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-3 rounded-xl bg-[#6EE7B7] text-black font-semibold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
