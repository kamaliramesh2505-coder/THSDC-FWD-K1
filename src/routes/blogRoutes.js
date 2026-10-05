const express = require('express');
const { body } = require('express-validator');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const titleValidator = body('title')
  .trim()
  .notEmpty()
  .withMessage('Title is required')
  .isLength({ min: 3, max: 200 })
  .withMessage('Title must be 3-200 characters');

const contentValidator = body('content')
  .trim()
  .notEmpty()
  .withMessage('Content is required');

const categoryValidator = body('category')
  .trim()
  .notEmpty()
  .withMessage('Category is required')
  .isLength({ max: 60 })
  .withMessage('Category must be at most 60 characters');

router.post(
  '/',
  authMiddleware,
  [titleValidator, contentValidator, categoryValidator],
  createBlog
);

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.put(
  '/:id',
  authMiddleware,
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Content cannot be empty'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Category cannot be empty'),
  ],
  updateBlog
);

router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
