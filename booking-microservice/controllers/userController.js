const UserProfile = require('../models/UserProfile');

exports.getDoctorProfiles = async (req, res) => {
    try {
        const doctors = await UserProfile.find({ user_type: 'doc' }, 'name specialty');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await UserProfile.findById(id);

        if (!profile || profile.user_type !== 'doc') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
