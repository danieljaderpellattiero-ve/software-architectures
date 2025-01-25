const express = require('express');
const { createUser, loginUser, updateUser, deleteUser, enable2FA, verify2FA } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);
router.post('/login', loginUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);
router.post('/2fa/enable', authMiddleware, enable2FA);
router.post('/2fa/verify', authMiddleware, verify2FA);

module.exports = router;