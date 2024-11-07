const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login_name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastlogin: { type: Date },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
