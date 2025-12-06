const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['admin','reception','guard'], default: 'reception' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
