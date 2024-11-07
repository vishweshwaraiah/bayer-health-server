const UserProfile = require('../models/UserProfile');

const axios = require('axios'); // For making HTTP requests
require('dotenv').config();

exports.getDoctorProfiles = async (req, res) => {
    try {
        // Find all user profiles where the user_type is 'doc'
        const doctors = await UserProfile.find({ user_type: 'doc' }, 'name specialty email phoneNumber');

        // Check if there are any doctors in the database
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }

        // Respond with the list of doctors
        res.status(200).json(doctors);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getDoctorProfileById = async (req, res) => {
    try {
        const { docId } = req.params;

        // Find the user profile with the given ID and user_type 'doc'
        const doctor = await UserProfile.findOne({ _id: docId, user_type: 'doc' });

        // Check if the doctor profile exists
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        // Respond with the doctor profile
        res.status(200).json(doctor);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.createUserProfile = async (req, res) => {

    try {
        const { login_name, password, name, age, gender, user_type, email, phoneNumber, specialty } = req.body;

        console.log(req.body);


        // Step 1: Insert user into auth microservice (auth user collection)
        const authServiceResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/register`, {
            "login_name":email,
            password
        });

        console.log(authServiceResponse);

        // Check if user creation in auth microservice was successful
        if (authServiceResponse.status !== 201) {
            return res.status(400).json({ message: 'Failed to create user in auth microservice' });
        }

        const userId = authServiceResponse.data.userId; // Assume the auth service returns the created user ID

        // Step 2: Check if the user profile already exists
        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'User profile already exists' });
        }

        // Step 3: Create a new user profile
        const userProfile = new UserProfile({ userId, name, age, gender, user_type, email, phoneNumber, specialty });
        await userProfile.save();
        
        res.status(201).json({ message: 'User profile created successfully', userProfile });
    } catch (error) {

        console.log(error);
        // Handle errors from axios and other sources
        if (error.response && error.response.data) {
            return res.status(500).json({ message: 'Auth service error', error: error.response.data });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const updates = req.body;
        updates.updated_at = Date.now();

        const updatedProfile = await UserProfile.findOneAndUpdate({ userId }, updates, { new: true });
        if (!updatedProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json({ message: 'User profile updated successfully', updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
