import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";
import { newApplicantAlertTemplate } from "../utils/emailTemplate.js";
import User from "../models/User.js";

export const applyJobService = async (jobId, studentId) => {
  const existingApplication = await Application.findOne({ jobId, studentId });
  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }
  const jobData = await Job.findById(jobId)
    .populate("postedBy", "fullName email")
    .lean();
  if (!jobData) {
    throw new Error("Job not found");
  }

  if (jobData.vacancy <= 0) {
    throw new Error("No more vacancies available for this job");
  }
  const newApplication = new Application({ jobId, studentId });
  await newApplication.save();
  await Job.findByIdAndUpdate(jobId, {
    $inc: { vacancy: -1 },
  });
  const studentData = await User.findById(studentId);
  try {
    let employer = jobData.postedBy;
    await sendEmail({
      to: employer.email,
      subject: "New Application Received! 📄",
      html: newApplicantAlertTemplate(
        employer.fullName,
        jobData.title,
        studentData.fullName,
      ),
    });
  } catch (error) {
    console.error(
      "Application saved, but failed to send email to employer:",
      error,
    );
  }
  return newApplication;
};

export const getAllByIdService = async (jobId) => {
  const applications = await Application.find({ jobId }).populate(
    "studentId",
    "fullName email",
  );
  return applications;
};

export const updateApplicationStatusService = async (
  applicationId,
  newStatus,
) => {
  const validStatuses = ["pending", "shortlisted", "hired", "rejected"];

  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid status type");
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    { status: newStatus },
    { new: true },
  );

  if (!updatedApplication) {
    throw new Error("Application not found");
  }

  return updatedApplication;
};

export const checkApplicationStatusService = async (jobId, studentId) => {
  const existingApplication = await Application.findOne({ jobId, studentId });
  if (existingApplication) {
    return true;
  } else {
    return false;
  }
};
