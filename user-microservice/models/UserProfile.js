const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    user_type: { type: String, enum: ['doc', 'patient', 'provider'], required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    specialty: { type: String, required: function() { return this.user_type === 'doc'; } },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
