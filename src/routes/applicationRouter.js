import express from "express";
import {
  applyJob,
  getAllById,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import verifyJWT from "../middlewares/auth.js";

const applicationRouter = express.Router();

applicationRouter.get("/:jobId", verifyJWT, getAllById);
applicationRouter.post("/apply/:jobId", verifyJWT, applyJob);
applicationRouter.patch(
  "/update/:applicationId",
  verifyJWT,
  updateApplicationStatus,
);

export default applicationRouter;
