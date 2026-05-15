import {
  createJobService,
  deleteJobService,
  updateJobService,
} from "../services/jobServices.js";

export const createJob = async (req, res, next) => {
  try {
    const employerId = req.user.id;
    const newJob = await createJobService(req.body, employerId);
    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await getAllJobsService();
    res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const employer = req.user;

    const deletedJob = await deleteJobService(jobId, employer);
    res.status(200).json({
      status: "success",
      message: "Job deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const employer = req.user;
    const updatedJob = await updateJobService(jobId, employer, req.body);

    res.status(200).json({
      status: "success",
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
