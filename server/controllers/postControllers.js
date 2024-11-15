// POST: /api/posts

const HttpError = require("../models/errorModel");
const Post = require("../models/postModel");
const User = require("../models/userModels");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

// create a post , protected
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(
        new HttpError("Fill in all fields and choose thumbnail.", 422)
      );
    }
    const { thumbnail } = req.files;
    // check the file size
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big. File should be less than 2mb.")
      );
    }
    let fileName = thumbnail.name;
    let splitName = fileName.split(".");
    let newFileName = splitName[0] + uuid() + "." + splitName[1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFileName,
            creator: req.user.userId,
          });
          if (!newPost) {
            return next(new HttpError("Error creating post.", 422));
          }
          //find user and  increase post count by 1
          const currentUser = await User.findById(req.user.userId);
          const userPostCount = currentUser.postCount + 1;
          await User.findByIdAndUpdate(req.user.userId, {
            postCount: userPostCount,
          });
          res
            .status(201)
            .json({ message: "Post created successfully.", post: newPost });
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

// GET: /api/posts
// get all posts , unprotected
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    return next(new HttpError(error));
  }
};

// GET: /api/posts/:id
// get single post , unprotected
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// GET: /api/posts/catergories/:category
// get posts by category , unprotected
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// GET: /api/posts/users/:id
// get user posts , unprotected
const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

// PATCH: /api/posts/:id
// edit post , unprotected
const editPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let { title, category, description } = req.body;
    if (!title || !category || !description) {
      return next(new HttpError("Fill in all fields.", 422));
    }
    if (!req.files) {
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        title,
        category,
        description,
      });
    } else {
      //get old post from database
      const oldPost = await Post.findById(postId);
      //delete old thumbnail
      fs.unlink(
        path.join(__dirname, "..", "/uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );
      //upload new thumbnail
      const { thumbnail } = req.files;
      // check the file size
      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("Thumbnail too big. File should be less than 2mb.")
        );
      }
      let fileName = thumbnail.name;
      let splitName = fileName.split(".");
      let newFileName = splitName[0] + uuid() + "." + splitName[1];
      thumbnail.mv(
        path.join(__dirname, "..", "/uploads", newFileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          category,
          description,
          thumbnail: newFileName,
        },
        { new: true }
      );
      if (!updatedPost) {
        return next(new HttpError("Error updating post.", 422));
      }
      res.status(200).json({
        message: "Post updated successfully.",
        post: updatedPost,
      });
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

// DELETE: /api/posts/:id
// delete post , unprotected
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavaliable.", 400));
    }
    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    // delete thumbnail from uploads folder
    if (fileName) {
      fs.unlink(
        path.join(__dirname, "..", "/uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );
    }
    await Post.findByIdAndDelete(postId);
    const currentUser = await User.findById(req.user.userId);
    const userPostCount = currentUser?.posts - 1;
    await User.findByIdAndUpdate(req.user.userId, { posts: userPostCount });

    res.json(`Post with id ${postId} deleted successfully.`);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPost,
  editPost,
  deletePost,
};
