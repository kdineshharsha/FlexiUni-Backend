import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJobService = async (jobId, studentId) => {
  const existingApplication = await Application.findOne({ jobId, studentId });
  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }
  const currentApplyCount = await Application.countDocuments({ jobId });
  const vacuncyCount = await Job.countDocuments({ jobId });
  if (currentApplyCount >= vacuncyCount) {
    throw new Error("No more vacancies available for this job");
  }
  const newApplication = new Application({ jobId, studentId });
  await newApplication.save();
  return newApplication;
};

export const getAllByIdService = async (jobId) => {
  const applications = await Application.find({ jobId }).populate(
    "studentId",
    "fullName email",
  );
  return applications;
};
