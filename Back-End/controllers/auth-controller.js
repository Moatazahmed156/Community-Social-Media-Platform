const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { sendMail } = require("../utils/mailer");
const { JWT_SECRET, CLIENT_URL } = require("../config/variables");

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    throw new HttpError("firstName, lastName, username, email and password are required.").BadRequest();
  }

  if (password.length < 6) {
    throw new HttpError("Password must be at least 6 characters long.").ValidationError();
  }

  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
  if (existing) {
    throw new HttpError("A user with that email or username already exists.").Conflict();
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    message: "Registration successful.",
    token,
    user: sanitizeUser(user),
  });
}, "Registration failed.");

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    throw new HttpError("email or username, and password are required.").BadRequest();
  }

  const user = await User.findOne(
    email ? { email: email.toLowerCase() } : { username }
  );

  if (!user) {
    throw new HttpError("Invalid credentials.").Unauthorized();
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError("Invalid credentials.").Unauthorized();
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "Login successful.",
    token,
    user: sanitizeUser(user),
  });
}, "Login failed.");

// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
}, "Failed to fetch current user.");

// @route  POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new HttpError("Email is required.").BadRequest();

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond the same way to avoid leaking which emails are registered.
  if (!user) {
    return res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  }

  const resetToken = jwt.sign({ id: user._id, purpose: "reset" }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetUrl = `${CLIENT_URL}/auth/reset-password/${resetToken}`;

  await sendMail(
    user.email,
    "Reset your CommunityHub password",
    `Reset your password using this link (valid for 15 minutes): ${resetUrl}`
  );

  res.status(200).json({
    message: "If that email is registered, a reset link has been sent.",
  });
}, "Failed to process password reset request.");

// @route  POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new HttpError("A new password of at least 6 characters is required.").ValidationError();
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new HttpError("Reset link is invalid or has expired.").Unauthorized();
  }

  if (decoded.purpose !== "reset") {
    throw new HttpError("Reset link is invalid or has expired.").Unauthorized();
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new HttpError("User not found.").NotFound();

  user.password = await bcrypt.hash(password, SALT_ROUNDS);
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully." });
}, "Failed to reset password.");

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
