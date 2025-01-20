const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Create account (public)
router.post('/', createUser);

// Login (public)
router.post('/login', loginUser);

// Update account (protected, any logged-in user)
router.put('/:id', authMiddleware, updateUser);

// Delete account (protected, admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;
