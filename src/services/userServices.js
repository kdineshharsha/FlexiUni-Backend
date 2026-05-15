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
  if (!email || !password) {
    throw new AppError("Please provide both email and password", 400);
  }
  const user = await User.findOne({ email }).select(
    "password _id fullName email role",
  );
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = bcrypt.compareSync(
    credentials.password,
    user.password,
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }
  const jwtPayload = {
    id: user._id,
    role: user.role,
  };
  const userData = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user: userData, token };
};
