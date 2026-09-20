import {
  getStudentProfileService,
  loginUserService,
  registerUserService,
  updateUserProfileService,
} from "../services/userServices.js";

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await registerUserService(req.body);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await loginUserService(req.body);
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updatedUser = await updateUserProfileService(userId, req.body);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const studentData = await getStudentProfileService(studentId);

    res.status(200).json({
      status: "success",
      data: studentData,
    });
  } catch (error) {
    next(error);
  }
};
