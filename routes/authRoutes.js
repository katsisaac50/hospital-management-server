const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);


router.get('/protected-route', protect, (req, res) => {
    res.send('This is a protected route');
});


module.exports = router;
