import {
  applyJobService,
  getAllByIdService,
} from "../services/applicationServices.js";

export const applyJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user.id;
    const newApplication = await applyJobService(jobId, studentId);
    res.status(201).json({
      status: "success",
      message: "Application created successfully",
      data: newApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllById = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const applications = await getAllByIdService(jobId);
    res.status(200).json({
      status: "success",
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
