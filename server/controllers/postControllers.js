// POST: /api/posts

const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");
const User = require("../models/userModels");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

// create a post , protected
const createPost = async (req, res, next) => {};

// GET: /api/posts
// get all posts , unprotected
const getPosts = async (req, res, next) => {};

// GET: /api/posts/:id
// get single post , unprotected
const getPost = async (req, res, next) => {};

// GET: /api/posts/catergories/:category
// get posts by category , unprotected
const getCatPosts = async (req, res, next) => {};

// GET: /api/posts/users/:id
// get user posts , unprotected
const getUserPost = async (req, res, next) => {};

// PATCH: /api/posts/:id
// edit post , unprotected
const editPost = async (req, res, next) => {};

// DELETE: /api/posts/:id
// delete post , unprotected
const deletePost = async (req, res, next) => {};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPost,
  editPost,
  deletePost,
};
