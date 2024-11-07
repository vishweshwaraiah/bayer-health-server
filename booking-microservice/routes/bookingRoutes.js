const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get available doctors
router.get('/doctors', authMiddleware, bookingController.getAvailableDoctors);

// Route to book a slot with a doctor
router.post('/book', authMiddleware, bookingController.bookSlot);
router.put('/update/:bookingId', authMiddleware, bookingController.updateBooking);
router.delete('/delete/:bookingId', authMiddleware, bookingController.deleteBooking);
router.get('/fetch', authMiddleware, bookingController.fetchBookings);

module.exports = router;
