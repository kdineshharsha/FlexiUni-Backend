import {
  applyJobService,
  checkApplicationStatusService,
  getAllByIdService,
  updateApplicationStatusService,
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

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    const newStatus = req.body.status;
    const updatedApplication = await updateApplicationStatusService(
      applicationId,
      newStatus,
    );
    res.status(200).json({
      status: "success",
      message: "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

export const checkApplicationStatus = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const jobId = req.params.jobId;
    const hasApplied = await checkApplicationStatusService(jobId, studentId);

    res.status(200).json({
      status: "success",
      hasApplied: hasApplied,
    });
  } catch (error) {
    next(error);
  }
};
