import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function parseVisitorPayload(text) {
  if (!text || typeof text !== "string") return null;
  const prefix = "visitor:";
  const t = text.trim();
  if (t.startsWith(prefix)) return t.slice(prefix.length);
  try {
    const parsed = JSON.parse(t);
    if (parsed?.v) return parsed.v;
  } catch (e) {
    return null;
  }
}
const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [lastVisitor, setLastVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const html5QRcodeRef = useRef(null);
  const qrRegionId = "qr-reader";

  useEffect(() => {
    return () => {
      if (html5QRcodeRef.current) {
        html5QRcodeRef.current.stop().catch(() => {});
        html5QRcodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  async function startScanner() {
    setMessage("");
    setLastVisitor(null);
    setScanning(true);
    const html5QrCode = new Html5Qrcode(qrRegionId, false);
    html5QRcodeRef.current = html5QrCode;

    try {
      const devices = await Html5Qrcode.getCameras();
      const cameraId = devices && devices.length ? devices[0].id : null;

      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (decodeText) => {
          try {
            await html5QrCode.stop();
          } catch (e) {}
          setScanning(false);

          const visitorId = parseVisitorPayload(decodeText);
          console.log(visitorId);
          if (!visitorId) {
            setMessage(`Invalid QR format. expect: visitor : ${id}`);
            return;
          }
          await doCheckIn(visitorId);
        },
        (errorMessage) => {
          console.warm("scan error", errorMessage);
        }
      );
    } catch (error) {
      console.error("Could not start scanner", err);
      setMessage("Could not start scanner: " + (err.message || err));
      setScanning(false);
    }
  }
  async function stopScanner() {
    setScanning(false);
    if (html5QRcodeRef.current) {
      try {
        await html5QRcodeRef.current.stop();
        await html5QRcodeRef.current.clear();
      } catch (e) {}
      html5QRcodeRef, (current = null);
    }
  }
  async function doCheckIn(visitorId) {
    setLoading(true);
    setMessage("");
    try {
      const payload = { visitorId };
      const res = await fetch(`${API_BASE}/api/checkin`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(
          "Check-in failed: " + (json?.error || `HTTP ${res?.status}`)
        );
        setLastVisitor(null);
        return;
      }
      if (json?.ok) {
        setMessage(json.message || "Checked in successfully");
        setLastVisitor(json.visitor || { visitorId });
      } else {
        setMessage("Unexpected response: " + JSON.stringify(json));
        setLastVisitor(null);
      }
    } catch (error) {
      console.error("checkin error", err);
      setMessage("Network error: " + (err.message || err));
      setLastVisitor(null);
    } finally {
      setLoading(false);
    }
  }
  async function manualCheckIn(e) {
    e.preventDefault();
    const id = e.target.elements.visitorId?.value?.trim();
    if (!id) {
      setMessage("Please enter a visitor ID");
      return;
    }
    await doCheckIn(id);
  }
  return (
    <>
      <div className="min-h-screen flex items-start justify-center p-6 bg-linear-to-b from-[#07101a] via-[#081324] to-[#06111a] text-white">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          {/* Scanner Card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-2">QR Scanner</h2>
            <p className="text-gray-300 text-sm mb-4">
              Scan visitor QR (visitor:{"{id}"}) and auto check in.
            </p>

            <div
              id={qrRegionId}
              className="w-full rounded-lg overflow-hidden bg-black mb-4"
              style={{ minHeight: 280 }}
            >
              {/* Camera region mounted by html5-qrcode */}
              {!scanning && (
                <div className="flex items-center justify-center h-full p-6 text-gray-400">
                  <div>
                    <p className="mb-2">Scanner idle</p>
                    <p className="text-xs">
                      Click start and allow camera access
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="px-4 py-2 rounded-xl bg-[#6EE7B7] text-black font-semibold"
                >
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Stop Scanner
                </button>
              )}

              <button
                onClick={() => {
                  setMessage("");
                  setLastVisitor(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-white"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-300">
              {loading && <p>Checking in...</p>}
              {message && <p className="text-[#6EE7B7]">{message}</p>}
              {lastVisitor && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm">
                    Visitor ID:{" "}
                    <span className="font-medium">{lastVisitor.visitorId}</span>
                  </p>
                  {lastVisitor.name && (
                    <p className="text-sm">Name: {lastVisitor.name}</p>
                  )}
                  {lastVisitor.checkinAt && (
                    <p className="text-sm">
                      Checked in at:{" "}
                      {new Date(lastVisitor.checkinAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Manual check-in card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-medium mb-2">Manual Check-in</h3>
            <p className="text-gray-300 text-sm mb-4">
              If camera not available, paste visitorId and check in manually.
            </p>

            <form onSubmit={manualCheckIn} className="space-y-3">
              <input
                name="visitorId"
                placeholder="visitor_xxx"
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/10 focus:ring-2 focus:ring-[#6EE7B7]"
              />
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl bg-[#6EE7B7] text-black font-semibold"
                  type="submit"
                >
                  Check In
                </button>
              </div>
            </form>

            <div className="mt-6 text-xs text-gray-400">
              <p>
                QR format expected:{" "}
                <span className="text-[#6EE7B7]">visitor:{"{id}"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scanner;
