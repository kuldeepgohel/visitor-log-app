import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authFetch from "../utils/authFetch";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("reception");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!email || !password) return setMsg("Email and Password are required");
    setLoading(true);

    try {
      const res = await authFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, role }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg(json.error || "Registration Failed");
        return;
      }
      setMsg("User Registration successfully");
      setEmail("");
      setPassword("");
      setName("");
      setRole("reception");
      setTimeout(() => nav("/"), 900);
    } catch (err) {
      console.error("register err", err);
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-[#07101a] via-[#081324] to-[#06111a] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-4">
          Register User (Admin only)
        </h2>

        {msg && <div className="mb-3 text-sm text-[#6EE7B7]">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="strong password"
              className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name (optional)"
              className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#6EE7B7]"
            >
              <option value="admin" className="bg-[#081324] text-white">
                Admin
              </option>
              <option value="reception" className="bg-[#081324] text-white">
                Reception
              </option>
              <option value="guard" className="bg-[#081324] text-white">
                Guard
              </option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#6EE7B7] text-black font-semibold"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("");
                setPassword("");
                setName("");
                setRole("reception");
                setMsg("");
              }}
              className="px-4 py-3 rounded-xl bg-white/10"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
