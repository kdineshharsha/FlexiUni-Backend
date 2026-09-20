import User from "../models/User.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUserService = async (userData) => {
  const { fullName, email, password, role, adminSecret, ...otherDetails } =
    userData;

  console.log("Registering user with data:", userData);

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
  if (role === "student") {
    if (!otherDetails.studentId || !otherDetails.university) {
      throw new AppError(
        "Student ID and University are required for student accounts",
        400,
      );
    }
  }
  if (role === "employer") {
    if (!otherDetails.companyName) {
      throw new AppError("Company name is required for employer accounts", 400);
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
    ...otherDetails,
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
  const user = await User.findOne({ email });
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

  let userData = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic,
    number: user.number,
  };

  if (user.role === "student") {
    userData = {
      ...userData,
      university: user.university,
      course: user.course,
      skills: user.skills,
      bio: user.bio,
    };
  } else if (user.role === "employer") {
    userData = {
      ...userData,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      website: user.website,
      companyAddress: user.companyAddress,
    };
  }

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user: userData, token };
};

export const updateUserProfileService = async (userId, updateData) => {
  const { password, role, email, _id, ...safeData } = updateData;

  const updatedUser = await User.findByIdAndUpdate(userId, safeData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const getStudentProfileService = async (studentId) => {
  const student = await User.findById(studentId).select("-password");
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};
