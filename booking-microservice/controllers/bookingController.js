const axios = require('axios');
const Booking = require('../models/Booking');
require('dotenv').config();

exports.getAvailableDoctors = async (req, res) => {
    try {
        // Fetch doctor profiles from the user microservice
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/profiles/doctors`, {
            headers: { 'x-auth-token': req.header('x-auth-token') }
        });

        if (response.status !== 200) {
            return res.status(500).json({ message: 'Failed to fetch doctor profiles' });
        }

        const doctors = response.data;
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.userId; // Extracted from authMiddleware

        // Find and delete the booking only if the userId matches the one in the booking
        const deletedBooking = await Booking.findOneAndDelete({ _id: bookingId, userId });

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.fetchBookings = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from authMiddleware

        // Fetch all bookings for the logged-in user
        const bookings = await Booking.find({ userId }).populate('doctorId', 'name specialty');

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { date, timeSlot } = req.body;
        const userId = req.user.userId; // Extracted from authMiddleware

        // Find and update the booking only if the userId matches the one in the booking
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: bookingId, userId },
            { date, timeSlot, updated_at: new Date() },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.bookSlot = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;
        const userId = req.user.userId; // Extracted from authMiddleware

        console.log("==asd==",`${process.env.USER_SERVICE_URL}/profiles/${doctorId}`);
        // Verify the doctor exists in the user microservice
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/profiles/${doctorId}`, {
            headers: { 'x-auth-token': req.header('x-auth-token') }
        });



        console.log(response);

        if (response.status !== 200) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create a new booking
        const newBooking = new Booking({
            userId,
            doctorId,
            date,
            timeSlot,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Slot booked successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error1', error: error.message });
    }
};
