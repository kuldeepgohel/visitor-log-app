import React, {useState} from 'react'
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
function App() {
    const [name, setName] = useState("");
    const [host, setHost] = useState("");
    const [visitorId, setVisitorId] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    function genRendomId () {
      return "v_" + Math.random().toString(36).slice(2,9);
    }
    
    async function handleGenerate(e) {
      e?.preventDefault();
      setMessage("");
      const id = visitorId || genRendomId();
      setVisitorId(id);
      setLoading(true);
      try {
        const body = {visitorId:id , name, host};
        const res = await fetch(`${API_BASE}/api/generate-qr`,{
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(body)
        });
        if(!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to generate QR code");
        }
        const json = await res.json();
        if(json?.dataUrl){
          setQrDataUrl(json.dataUrl)
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
      <div className='container'>
        <header>
          <h1>Visitor Log — QR Generator</h1>
          <p className="muted">Quick dev page to generate QR and test your backend</p>
        </header>
        <form onSubmit={handleGenerate} className='form'>
        <label htmlFor="">
          Visitor name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. John Doe' autoFocus/>
        </label>

        <label>
          Visitor ID (optional — auto-generated if blank)
          <input value={visitorId} onChange={(e) => setVisitorId(e.target.value)} />
        </label>
        <div className='actions'>
          <button type='submit' disabled={loading}>
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        </div>
        </form>
        <section className='qr-area'>
        {
          qrDataUrl ? (
            <>
            <h3>QR Preview</h3>
            <img src={qrDataUrl} alt="QR code" className='qr-img' />
            <p className='muted'> right click image to save. Or scan with phone camera.</p>
            </>
          ):(
            <p className='muted'>No QR yet. Fill fields and generate.</p>
          )
        }
        </section>
        {message && <div className="message">{message}</div>}
        <footer className="muted small">Backend used: {API_BASE}</footer>
      </div>
    </>
    
  )
}

export default App
