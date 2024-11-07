const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const staticValidation = require('../middlewares/staticValidation');

// Public route with static validation
router.post('/create', staticValidation, userController.createUserProfile);

// Protected routes with JWT validation
router.put('/update', authMiddleware, userController.updateUserProfile);
router.get('/fetch', authMiddleware, userController.getUserProfile);

// Route to get all doctor profiles
router.get('/profiles/doctors', authMiddleware, userController.getDoctorProfiles);

router.get('/profiles/:docId', authMiddleware, userController.getDoctorProfileById);


module.exports = router;
