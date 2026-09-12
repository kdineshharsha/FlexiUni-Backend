import Application from "../models/Application.js";
import Job from "../models/Job.js";
import AppError from "../utils/appError.js";
import User from "../models/User.js";

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

  let { requirements, ...otherJobDetails } = updateData;
  if (requirements) {
    let processedRequirements = [];
    if (typeof requirements === "string") {
      processedRequirements = requirements
        .split(/\\n|\n|\r\n/)
        .filter((req) => req.trim() !== "");
    } else if (Array.isArray(requirements)) {
      processedRequirements = requirements
        .flatMap((req) => req.split(/\\n|\n|\r\n/))
        .filter((req) => req.trim() !== "");
    }

    otherJobDetails.requirements = processedRequirements;
  }
  const updatedJob = await Job.findByIdAndUpdate(jobId, otherJobDetails, {
    returnDocument: "after",
  });
  return updatedJob;
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId).populate("postedBy", "fullName email");
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return job;
};

export const getJobsByFilterService = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.keyword) {
    filter.$or = [
      { title: { $regex: query.keyword, $options: "i" } },
      { description: { $regex: query.keyword, $options: "i" } },
    ];
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }
  if (query.category && query.category !== "All Categories") {
    filter.category = query.category;
  }

  const totalJobs = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .populate("postedBy", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return {
    jobs,
    totalJobs,
    totalPages: Math.ceil(totalJobs / limit),
    currentPage: page,
  };
};

export const getEmployerJobsService = async (employerId) => {
  const jobs = await Job.find({ postedBy: employerId }).sort({ createdAt: -1 });
  return jobs;
};

export const getRecommendedJobsService = async (studentId) => {
  const student = await User.findById(studentId).lean();
  console.log(studentId);
  if (!student) {
    const error = new Error("Student profile not found");
    error.statusCode = 404;
    throw error;
  }

  const pastApplications = await Application.find({ studentId })
    .populate("jobId", "category shiftDetails")
    .lean();

  const appliedJobIds = pastApplications
    .filter((app) => app.jobId?._id)
    .map((app) => app.jobId._id);

  const categoryCounts = {};
  let weekendShiftCount = 0;
  let totalValidShifts = 0;

  pastApplications.forEach((app) => {
    if (app.jobId?.category) {
      const cat = app.jobId.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    if (app.jobId?.shiftDetails) {
      totalValidShifts++;
      if (/weekend/i.test(app.jobId.shiftDetails)) {
        weekendShiftCount++;
      }
    }
  });

  const preferredCategories = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a],
  );

  const prefersWeekend =
    totalValidShifts > 0 && weekendShiftCount / totalValidShifts >= 0.5;

  const studentLocation = (student.location || "").trim();

  const pipeline = [
    {
      $match: {
        _id: { $nin: appliedJobIds },
        vacancy: { $gt: 0 },
      },
    },

    // B. Scoring System (+40 Location, +30 Category, +30 Shift)
    {
      $addFields: {
        score: {
          $add: [
            // 1. Location Match (+40)
            studentLocation
              ? {
                  $cond: [
                    {
                      $regexMatch: {
                        input: "$location",
                        regex: studentLocation,
                        options: "i",
                      },
                    },
                    40,
                    0,
                  ],
                }
              : 0,

            // 2. Category History Match (+30)
            preferredCategories.length > 0
              ? {
                  $cond: [{ $in: ["$category", preferredCategories] }, 30, 0],
                }
              : 0,

            // 3. Shift Pattern Match (+30)
            prefersWeekend
              ? {
                  $cond: [
                    {
                      $regexMatch: {
                        input: "$shiftDetails",
                        regex: "weekend",
                        options: "i",
                      },
                    },
                    30,
                    0,
                  ],
                }
              : 0,
          ],
        },
      },
    },

    {
      $sort: {
        score: -1,
        createdAt: -1,
      },
    },

    {
      $limit: 6,
    },

    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    {
      $unwind: {
        path: "$postedBy",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        "postedBy.password": 0,
        "postedBy.__v": 0,
        score: 0,
      },
    },
  ];

  const recommendedJobs = await Job.aggregate(pipeline);
  return recommendedJobs;
};
