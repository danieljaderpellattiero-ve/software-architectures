const Log = require('../models/Log');

const logAction = async (userId, action, entityType, entityId) => {
  try {
    await Log.create({
      user: userId,
      action,
      details: {
        entityType,
        entityId,
      },
    });
  } catch (error) {
    console.error('Error logging action:', error.message);
  }
};

module.exports = logAction;
