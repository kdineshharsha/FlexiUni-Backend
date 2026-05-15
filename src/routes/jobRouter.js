import {
  createJob,
  deleteJob,
  updateJob,
} from "../controllers/jobController.js";

import express from "express";
import verifyJWT from "../middlewares/auth.js";

const jobRouter = express.Router();

jobRouter.post("/create", verifyJWT, createJob);
jobRouter.delete("/delete/:jobId", verifyJWT, deleteJob);
jobRouter.patch("/update/:jobId", verifyJWT, updateJob);

export default jobRouter;
