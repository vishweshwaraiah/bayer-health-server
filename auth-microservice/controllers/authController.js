const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid'); // For generating unique user IDs if needed

exports.register = async (req, res) => {
    try {
        const { login_name, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ login_name });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            login_name,
            password: hashedPassword,
            status: 'active',
            lastlogin: null, // Set as null initially
            created_at: new Date(),
            modified_at: new Date()
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with the new user's ID and a success message
        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: savedUser._id  // Return the last inserted ID
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.login = async (req, res) => {

    console.log(req.body);
    const { login_name, password } = req.body;

    console.log("login_name",login_name);

    console.log("password",password);

    try {
        const user = await User.findOne({ login_name });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user._id, login_name: user.login_name };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.authenticate = (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.status(200).json({ message: 'Authorized' });
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
