const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const validate = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      errors: errors.array(),
    });
    return false;
  }

  return true;
};

const createBlog = async (req, res, next) => {
  if (!validate(req, res)) return;

  try {
    const { title, content, category } = req.body;

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      author: req.user._id,
      authorName: req.user.name,
    });

    const populated = await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      blog: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.author) {
      if (!mongoose.isValidObjectId(req.query.author)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid author ID',
        });
      }
      filter.author = req.query.author;
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email'
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  if (!validate(req, res)) return;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to edit this blog',
      });
    }

    const { title, content, category } = req.body;

    if (title !== undefined) blog.title = title.trim();
    if (content !== undefined) blog.content = content.trim();
    if (category !== undefined) blog.category = category.trim();

    await blog.save();

    const populated = await blog.populate('author', 'name email');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: populated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this blog',
      });
    }

    await Blog.deleteOne({ _id: blog._id });

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
