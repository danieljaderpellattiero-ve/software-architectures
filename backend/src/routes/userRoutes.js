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

router.post('/', createUser);


router.post('/login', loginUser);


router.put('/:id', authMiddleware, updateUser);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;
