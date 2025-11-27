let Visitor = require('../models/Visitor');

const checkIn = async ( req, res) => {
  try {
    const { visitorId } = req.body;
    if (!visitorId) {
      return res.status(400).json({ ok: false, error: 'visitorId is required' });
    }
    const id = String(visitorId).trim();
    let v = await Visitor.findOne({ visitorId:id});
    if(!v) {
      v = new Visitor({ visitorId: id, status: 'checked_in', checkinAt: new Date() });
    } else {
      v.status = 'checked_in';
      v.checkinAt = new Date();
    }
    await v.save();
    return res.json({
      ok: true,
      message: 'Checked in',
      visitor: {
        visitorId: v.visitorId,
        name: v.name,
        host: v.host,
        checkinAt: v.checkinAt
      }
    });
  } catch (err) {
    console.error('checkIn error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok:false, error:'Internal server error' });
  }
}

module.exports = { checkIn };