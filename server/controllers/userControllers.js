const bcrypt = require("bcryptjs");
const HttpError = require("../models/errorModel");
const User = require("../models/userModels");

//api/users/register
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, password2 } = req.body;
    //fill
    if (!username || !email || !password || !password2) {
      return next(new HttpError("Please fill in all fields", 422));
    }
    //password
    if (password.trim().length < 6) {
      return next(new HttpError("Password must be at least 6 characters", 422));
    }
    if (password !== password2) {
      return next(new HttpError("Passwords do not match", 422));
    }
    //email
    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }
    //create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email: newEmail,
      password: hashedPassword,
    });
    res.status(201).json(`User ${newUser.email} registered successfully`);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Registration failed, please try again", 422));
  }
};

//api/users/login
const loginUser = async (req, res, next) => {
  res.json("login user");
};

//api/users/:id
const getUser = async (req, res, next) => {
  res.json("get user profile");
};

//api/users/change-avatar
const changeAvatar = async (req, res, next) => {
  res.json("change user avatar");
};

//api/users/edit-user
const editUser = async (req, res, next) => {
  res.json("edit user");
};

//api/users/
const getAuthors = async (req, res, next) => {
  res.json("get all users/authors");
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
