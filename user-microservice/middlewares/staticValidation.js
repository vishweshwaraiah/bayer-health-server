require('dotenv').config();

const staticValidation = (req, res, next) => {
    const staticKey = req.header('x-static-key');
    if (!staticKey || staticKey !== process.env.STATIC_API_KEY) {
        return res.status(401).json({ message: 'Unauthorized access: invalid static key' });
    }
    next();
};

module.exports = staticValidation;
