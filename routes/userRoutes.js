const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware'); // Middleware for authentication
const router = express.Router();

router.post('/register', registerUser); // Public
router.post('/login', loginUser);       // Public

// router.get('/', protect, admin, getAllUsers);          // Admin only
// router
//   .route('/:id')
//   .get(protect, getUserById)                           // Protected
//   .put(protect, admin, updateUserRole);                // Admin only

module.exports = router;


