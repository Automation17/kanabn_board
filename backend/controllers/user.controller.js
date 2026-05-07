const User = require('../models/User');

// GET /api/users → Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}

module.exports = { getAllUsers };