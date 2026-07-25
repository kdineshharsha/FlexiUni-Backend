import express from "express";
import {
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/userController.js";
import verifyJWT from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/update-profile", verifyJWT, updateProfile);

export default userRouter;
