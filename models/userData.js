const mongoose = require('mongoose');

const fileEntrySchema = new mongoose.Schema({
  storedName: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  uname: { type: String, required: true, unique: true, trim: true },
  pass: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  files: [fileEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('userData', userSchema);
