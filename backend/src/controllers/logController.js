const Log = require('../models/Log');

// Fetch all logs for admin
exports.getLogs = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    const logs = await Log.find().populate('user', 'name email role');
    res.status(200).json({ message: 'Logs fetched successfully', logs });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: error.message });
  }
};