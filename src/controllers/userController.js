import {
  loginUserService,
  registerUserService,
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
