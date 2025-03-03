const bcrypt = require("bcryptjs");
const HttpError = require("../models/errorModel");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const domainConfig = require("../config/domains");

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

    // 生成 Access Token
    const access_token = jwt.sign(
      { userId: newUser.id, email: newUser.email, scope: ["blog", "admin"] }, // 添加 scope 字段
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access Token 有效期为 15 分钟
    );

    // 生成 Refresh Token
    const refresh_token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" } // Refresh Token 有效期为 30 天
    );

    // 将 Refresh Token 存储在 HTTPOnly Cookie 中
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30天的毫秒数
    });

    // 返回 Access Token 和用户信息
    res.status(200).json({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      token: access_token,
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

    // 生成 Access Token
    const access_token = jwt.sign(
      { userId: user.id, email: user.email, scope: ["blog", "admin"] }, // 添加 scope 字段
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access Token 有效期为 15 分钟
    );

    // 生成 Refresh Token
    const refresh_token = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" } // Refresh Token 有效期为 30 天
    );

    // 将 Refresh Token 存储在 HTTPOnly Cookie 中
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      domain: domainConfig.domain,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30天的毫秒数
    });

    // 返回 Access Token 和用户信息
    res.status(200).json({
      userId: user.id,
      email: user.email,
      username: user.username,
      token: access_token,
    });
  } catch (error) {
    console.log(error);
    // 处理捕获到的任何异常
    return next(
      new HttpError("Login failed. Please check your credentials.", 422)
    );
  }
};

//api/users/refresh-token
// 刷新 Token 的接口
const refreshToken = async (req, res, next) => {
  try {
    // 从 Cookie 中获取 Refresh Token
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return next(new HttpError("No refresh token provided.", 401));
    }

    let userId;
    try {
      // 验证 Refresh Token
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return next(new HttpError("Invalid refresh token.", 401));
    }

    // 查找用户信息
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found.", 401));
    }

    // 生成新的 Access Token
    const access_token = jwt.sign(
      { userId: user.id, email: user.email, scope: ["blog", "admin"] }, // 添加 scope 字段
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access Token 有效期为 15 分钟
    );

    // 可选：生成新的 Refresh Token 并更新 Cookie
    const newRefresh_token = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" } // Refresh Token 有效期为 30 天
    );

    res.cookie("refresh_token", newRefresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      domain: domainConfig.domain,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30天的毫秒数
    });

    // 返回新的 Access Token
    res.status(200).json({
      token: access_token,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to refresh token." + error, 500));
  }
};

const verifyToken = async (req, res) => {
  const token = req.cookies.refresh_token;

  if (!token) return res.status(401).json({ message: "未登录" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    // 生成新的 access token
    const access_token = jwt.sign(
      { userId: user.id, email: user.email, scope: ["blog", "admin"] },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      userId: user.id,
      email: user.email,
      username: user.username,
      token: access_token,
    });
  } catch (error) {
    res.status(401).json({ message: "无效的 Token" });
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

//display/users/follow/:id
const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return next(new HttpError("User not found", 404));
    }

    if (req.user.userId === req.params.id) {
      return next(new HttpError("You cannot follow yourself", 422));
    }

    if (currentUser.followedUsers.includes(req.params.id)) {
      return next(new HttpError("You already follow this user", 422));
    }

    // 更新当前用户的关注列表
    await User.findByIdAndUpdate(req.user._id, {
      $push: { followedUsers: req.params.id },
    });

    // 更新被关注用户的粉丝列表
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

//display/users/unfollow/:id
const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return next(new HttpError("User not found", 404));
    }

    if (!currentUser.followedUsers.includes(req.params.id)) {
      return next(new HttpError("You are not following this user", 422));
    }

    // 更新当前用户的关注列表
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followedUsers: req.params.id },
    });

    // 更新被取消关注用户的粉丝列表
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

//display/users/:id/following
const getFollowedUsers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followedUsers", "-password")
      .select("followedUsers");

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json(user.followedUsers);
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

//display/users/:id/followers
const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "-password")
      .select("followers");

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json(user.followers);
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

// 获取用户统计数据
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // 1. 获取用户的文章列表
    const userPosts = await Post.find({ creator: userId });
    const postIds = userPosts.map((post) => post._id);

    // 2. 统计获得的点赞数
    const likesStats = await Post.aggregate([
      {
        $match: {
          _id: { $in: postIds },
        },
      },
      {
        $unwind: "$likes",
      },
      {
        $group: {
          _id: null,
          last7Days: {
            $sum: {
              $cond: [{ $gte: ["$likes.createdAt", sevenDaysAgo] }, 1, 0],
            },
          },
          last30Days: {
            $sum: {
              $cond: [{ $gte: ["$likes.createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    // 3. 统计获得的收藏数
    const favoritesStats = await Post.aggregate([
      {
        $match: {
          _id: { $in: postIds },
        },
      },
      {
        $unwind: "$favorites",
      },
      {
        $group: {
          _id: null,
          last7Days: {
            $sum: {
              $cond: [{ $gte: ["$favorites.createdAt", sevenDaysAgo] }, 1, 0],
            },
          },
          last30Days: {
            $sum: {
              $cond: [{ $gte: ["$favorites.createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    // 4. 统计获得的评论数
    const commentsStats = await Comment.aggregate([
      {
        $match: {
          post: { $in: postIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          last7Days: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
            },
          },
          last30Days: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    // 5. 统计新增粉丝数
    const followersStats = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$followers",
      },
      {
        $group: {
          _id: null,
          last7Days: {
            $sum: {
              $cond: [{ $gte: ["$followers.createdAt", sevenDaysAgo] }, 1, 0],
            },
          },
          last30Days: {
            $sum: {
              $cond: [{ $gte: ["$followers.createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      likes: likesStats[0] || { last7Days: 0, last30Days: 0 },
      favorites: favoritesStats[0] || { last7Days: 0, last30Days: 0 },
      comments: commentsStats[0] || { last7Days: 0, last30Days: 0 },
      followers: followersStats[0] || { last7Days: 0, last30Days: 0 },
    });
  } catch (error) {
    return next(new HttpError(error.message, error.statusCode));
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  verifyToken,
  getUser,
  getAuthors,
  followUser,
  unfollowUser,
  getFollowedUsers,
  getFollowers,
  getUserStats,
};
