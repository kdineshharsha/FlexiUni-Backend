import express from "express";
import { applyJob, getAllById } from "../controllers/applicationController.js";
import verifyJWT from "../middlewares/auth.js";

const applicationRouter = express.Router();

applicationRouter.get("/:jobId", verifyJWT, getAllById);
applicationRouter.post("/apply/:jobId", verifyJWT, applyJob);

export default applicationRouter;
