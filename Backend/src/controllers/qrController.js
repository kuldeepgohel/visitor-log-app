const QRCode = require('qrcode');

exports.generateQR = async (req, res) => {
  try {
    const { visitorId, name, host } = req.body;

    if (!visitorId) {
      return res.status(400).json({ ok: false, error: 'visitorId is required' });
    }

    const payload = `visitor:${visitorId.trim()}`;
    const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M' });

    return res.json({ ok: true, visitorId, name, host, dataUrl });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
};
