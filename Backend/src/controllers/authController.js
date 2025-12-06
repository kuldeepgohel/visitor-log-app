const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

exports.register = async (req,res) => {
    try {
        const { email, password, name, role} = req.body;
        if(!email || !password) {
            return res.status(400).json({ ok : false, error:'Email and Password are required'});
        }
        const existing = await User.findOne({email});
        if(existing) {
            return res.status(409).json({ ok:false, error:'User exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({email, passwordHash, name, role});
        await user.save();

        return res.status(201).json({ ok:true, message:'User registered successfully'});
    } catch (error) {
        console.error('auth.register err', err);
        return res.status(500).json({ ok:false, error:'Internal server error' });
    }
}

exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ ok : false, error:'Email and Password are required'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ok:false, error:'Invalid email or password'});
        }

        const matchPassword = await bcrypt.compare(password,user.passwordHash);
        if(!matchPassword) {
            return res.status(401).json({ok:false, error:'Invalid email or password'});
        }
        const payload = { sub: user._id.toString(), role:user.role, email:user.email};
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES});

        return res.status(200).json({ok: true, token, user:{ id: user._id, email:user.email, name: user.name, role:user.role}})
    } catch (error) {
        console.error('auth.login err', error);
        return res.status(500).json({ ok:false, error:'Internal server error' });
    }
}

exports.me = async (req,res) => {
    // auth middleware sets req.user
    const u = req.user;
    if(!u) {
        return res.status(401).json({ok:false, error:"Unauthorized"});
    }
    return res.status(200).json({ok: true, user: { id:u.sub, email:u.email, role:u.role}})
}