const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function authMiddleware (req, res, next){
    const auth = req.headers.authorization || '';
    const parts = auth.split('');
    if(parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ok: false, error:'Missing or Invalid token'});
    } 
    const token = parts[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.error('authMiddleware err', err && err.message);
        return res.status(401).json({ ok:false, error:'Invalid token' });
    }
}