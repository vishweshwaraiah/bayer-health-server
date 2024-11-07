const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profiles/doctors', authMiddleware, userController.getDoctorProfiles);
router.get('/profiles/:id', authMiddleware, userController.getUserProfileById);

module.exports = router;
