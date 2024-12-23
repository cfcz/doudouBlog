const bcrypt = require("bcryptjs");
const HttpError = require("../models/errorModel");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");

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

    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 将令牌存储在 HTTPOnly cookie 中
    // 将令牌存储在 HTTPOnly cookie 中
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    // 返回用户信息
    res.status(200).json({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Registration failed, please try again", 422));
  }
};

//api/users/login
const loginUser = async (req, res, next) => {
  try {
    // 解析请求体中的邮箱和密码
    const { email, password } = req.body;

    // 检查邮箱和密码是否为空
    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // 将邮箱转换为小写形式
    const newEmail = email.toLowerCase();

    // 查询数据库以获取对应的用户信息
    const user = await User.findOne({ email: newEmail });

    // 如果没有找到匹配的用户，则抛出错误
    if (!user) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    // 使用 bcrypt 库比较输入的密码与数据库中存储的哈希密码
    const comparePass = await bcrypt.compare(password, user.password);

    // 如果密码不匹配，则抛出错误
    if (!comparePass) {
      return next(new HttpError("Invalid credentials.", 422));
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 将令牌存储在 HTTPOnly cookie 中
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);

    // 返回用户信息
    res.status(200).json({
      userId: user.id,
      email: user.email,
      username: user.username,
      token: token,
    });
  } catch (error) {
    // 处理捕获到的任何异常
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

//api/users/:id
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 使用 findById 方法查找具有指定 ID 的用户，并排除密码字段
    const user = await User.findById(id).select("-password");

    // 检查用户是否存在
    if (!user) {
      // 如果用户不存在，抛出一个带有自定义消息和状态码的 HttpError 对象
      return next(new HttpError("User not found.", 404));
    }

    // 设置响应的状态码为 200 并将用户对象作为 JSON 发送给客户端
    res.status(200).json(user);
  } catch (error) {
    // 捕获并处理任何可能发生的错误
    return next(new HttpError(error.message, error.statusCode));
  }
};

//api/users/change-avatar
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      // 如果未提供头像文件，则返回错误
      return next(new HttpError("Please choose an image.", 422));
    }

    // 从数据库中查找用户
    const user = await User.findById(req.user.userId);

    // 删除旧的头像文件（如果存在）
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }
    //TODO: 大文件处理？
    // 检查头像文件大小
    const { avatar } = req.files;
    if (avatar.size > 500000) {
      // 如果头像文件大于 500KB，则返回错误
      return next(
        new HttpError("Profile picture too big. Should be less than 500kb", 422)
      );
    }
    let fileName; // 初始化文件名变量

    fileName = avatar.name; // 获取头像文件名

    let splittedFilename = fileName.split("."); // 分割文件名以获取扩展名

    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1]; // 生成新的唯一文件名

    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        // 移动文件到 uploads 目录
        if (err) {
          return next(new HttpError(err)); // 如果移动失败，返回错误
        }

        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.userId,
          { avatar: newFilename },
          { new: true }
        ); // 更新用户头像

        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be changed.", 422)); // 如果更新失败，返回错误
        }

        res.status(200).json(updatedAvatar); // 成功返回更新后的用户信息
      }
    );
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

//api/users/edit-user
const editUser = async (req, res, next) => {
  try {
    const { username, email, password, newPassword, newPassword2 } = req.body;
    //fill
    if (!username || !email || !password || !newPassword || !newPassword2) {
      return next(new HttpError("Please fill in all fields", 422));
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return next(new HttpError("User not found", 403));
    }
    //make sure email doesn't exist
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id !== req.user.userId) {
      return next(new HttpError("Email already exists", 422));
    }
    //compare password
    const validateUserPassword = await bcrypt.compare(password, user.password);
    if (!validateUserPassword) {
      return next(new HttpError("Invalid password", 422));
    }
    if (newPassword !== newPassword2) {
      return next(new HttpError("Passwords do not match", 422));
    }
    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    //update user
    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email, password: hashedPassword },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

//api/users/
const getAuthors = async (req, res, next) => {
  try {
    // 查询所有用户，并排除密码字段
    const authors = await User.find().select("-password");

    // 将查询结果作为 JSON 响应发送回客户端
    res.json(authors);
  } catch (error) {
    // 捕获并处理任何可能发生的错误
    return next(new HttpError(error.message, error.statusCode));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
