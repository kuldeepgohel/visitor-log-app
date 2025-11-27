import React, { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
function App() {
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function genRendomId() {
    return "v_" + Math.random().toString(36).slice(2, 9);
  }

  async function handleGenerate(e) {
    e?.preventDefault();
    setMessage("");
    const id = visitorId || genRendomId();
    setVisitorId(id);
    setLoading(true);
    try {
      const body = { visitorId: id, name, host };
      const res = await fetch(`${API_BASE}/api/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate QR code");
      }
      const json = await res.json();
      if (json?.dataUrl) {
        setQrDataUrl(json.dataUrl);
        setMessage("QR code generated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error generating QR: " + (err.message || err));
      setQrDataUrl("");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-[#07101a] via-[#081324] to-[#06111a] text-white">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10">
          {/* LEFT PANEL */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <h1 className="text-2xl font-semibold mb-1">
              Visitor Log — QR Generator
            </h1>
            <p className="text-gray-300 mb-6 text-sm">
              Create visitor QR codes instantly.
            </p>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-sm text-gray-300">Visitor name</label>
                <input
                  className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EE7B7]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              {/* HOST */}
              <div>
                <label className="text-sm text-gray-300">Host (optional)</label>
                <input
                  className="w-full mt-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EE7B7]"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="host@company"
                />
              </div>

              {/* VISITOR ID */}
              <div>
                <label className="text-sm text-gray-300">Visitor ID</label>
                <div className="flex gap-3 mt-1">
                  <input
                    className="flex-1 px-4 py-3 bg-transparent border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EE7B7]"
                    value={visitorId}
                    onChange={(e) => setVisitorId(e.target.value)}
                    placeholder="Auto-generated if blank"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVisitorId(genRendomId());
                      setQrDataUrl("");
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#6EE7B7] font-semibold"
                  >
                    gen
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-[#6EE7B7] text-black font-semibold hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate QR"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQrDataUrl("");
                    setMessage("");
                    setVisitorId("");
                    setName("");
                    setHost("");
                  }}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                >
                  Clear
                </button>
              </div>
            </form>

            {message && (
              <p className="text-[#6EE7B7] text-sm mt-4">{message}</p>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium mb-4">QR Preview</h2>

            <div className="w-64 h-64 bg-white/90 rounded-xl flex items-center justify-center p-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="qr"
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-gray-600 text-center">No QR yet</p>
              )}
            </div>

            {qrDataUrl && (
              <div className="mt-5 flex gap-3">
                <a
                  className="px-4 py-2 rounded-lg bg-white/10 text-[#6EE7B7] font-semibold"
                  href={qrDataUrl}
                  download={`qr_${visitorId}.png`}
                >
                  Download
                </a>

                <button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white"
                  onClick={() => navigator.clipboard.writeText(qrDataUrl)}
                >
                  Copy URL
                </button>
              </div>
            )}

            <p className="mt-6 text-xs text-gray-400">
              QR contains{" "}
              <span className="text-[#6EE7B7]">visitor:{"id"}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
