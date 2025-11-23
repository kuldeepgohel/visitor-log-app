const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/generate-qr', async (req,res)=> {
    const {visitorId} = req.body;
    const data = `visitor:${visitorId}`;
    try {
        const dataURL = await QRCode.toDataURL(data);
        res.json({dataUrl:dataURL});  
    } catch (error) {
        res.status(500).json({error:"QR error"});
    }
})

app.listen(4000,() => {
    console.log("API running on port 4000");
})