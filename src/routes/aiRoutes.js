const express = require('express');
const { body } = require('express-validator');
const {
  generateBlog,
  summarizeBlog,
} = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/generate-blog',
  authMiddleware,
  [
    body('topic')
      .trim()
      .notEmpty()
      .withMessage('Topic is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Topic must be 3-200 characters'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Category cannot be empty'),
  ],
  generateBlog
);

router.post(
  '/summarize',
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ min: 20 })
      .withMessage('Content must contain at least 20 characters'),
  ],
  summarizeBlog
);

module.exports = router;
