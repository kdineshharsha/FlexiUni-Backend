import Application from "../models/Application.js";
import Job from "../models/Job.js";
import AppError from "../utils/appError.js";

export const createJobService = async (jobData, employerId) => {
  if (!jobData.title || !jobData.description || !jobData.location) {
    throw new AppError("Title, description, and location are required", 400);
  }
  if (!employerId) {
    throw new AppError("Employer ID is required", 400);
  }
  const newJobData = {
    ...jobData,
    postedBy: employerId,
  };

  const job = new Job(newJobData);
  await job.save();
  return job;
};

export const getAllJobsService = async () => {
  const jobs = await Job.find().populate("postedBy", "fullName email");
  return jobs;
};

export const deleteJobService = async (jobId, employer) => {
  const job = await Job.findById(jobId);
  const employerId = employer.id.toString();
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.postedBy.toString() !== employerId && employer.role !== "admin") {
    throw new AppError("You are not authorized to delete this job", 403);
  }
  await job.deleteOne();
  await Application.deleteMany({ jobId: jobId });
  return job;
};

export const updateJobService = async (jobId, employer, updateData) => {
  const job = await Job.findById(jobId);
  const employerId = employer.id.toString();
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  if (job.postedBy.toString() !== employerId && employer.role !== "admin") {
    throw new AppError("You are not authorized to update this job", 403);
  }
  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
    returnDocument: "after",
  });
  return updatedJob;
};
