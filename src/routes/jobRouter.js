import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  updateJob,
  getJobsByFilter,
  getEmployerJobs,
  getRecommendedJobs,
} from "../controllers/jobController.js";

import express from "express";
import verifyJWT from "../middlewares/auth.js";

const jobRouter = express.Router();

jobRouter.get("/", getJobsByFilter);
jobRouter.get("/all", getAllJobs);
jobRouter.get("/recommended", verifyJWT, getRecommendedJobs);
jobRouter.get("/:jobId", getJobById);
jobRouter.post("/create", verifyJWT, createJob);
jobRouter.get("/employer/jobs", verifyJWT, getEmployerJobs);
jobRouter.delete("/delete/:jobId", verifyJWT, deleteJob);
jobRouter.patch("/update/:jobId", verifyJWT, updateJob);

export default jobRouter;
