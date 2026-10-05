const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  profile,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be 2-80 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6, max: 100 })
      .withMessage('Password must be 6-100 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  login
);

router.get('/profile', authMiddleware, profile);

module.exports = router;
