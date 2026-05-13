import User from "../models/User.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUserService = async (userData) => {
  const {
    fullName,
    email,
    number,
    studentId,
    password,
    role,
    university,
    location,
    adminSecret,
  } = userData;

  if (!fullName || !email || !password || !role) {
    throw new AppError("Missing required fields", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }
  if (role === "admin") {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new AppError("Unauthorized, invalid admin secret", 403);
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    number,
    studentId,
    password: hashedPassword,
    role,
    university,
    location,
  });
  await user.save();
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

export const loginUserService = async (credentials) => {
  const { email, password } = credentials;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }
  const userData = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { user: userData, token };
};
