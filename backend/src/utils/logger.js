const Log = require('../models/Log');

const logAction = async (userId, action, resource, resourceId) => {
  try {
    await Log.create({ userId, action, resource, resourceId });
    console.log(`Log recorded: ${action} on ${resource} by User ${userId}`);
  } catch (error) {
    console.error('Error recording log:', error.message);
  }
};

module.exports = logAction;
