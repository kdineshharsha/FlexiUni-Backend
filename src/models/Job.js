import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: { type: [String], default: [] },
    category: {
      type: String,
      enum: [
        "Supermarket",
        "Garment",
        "Shop",
        "Delivery",
        "Retail",
        "F&B",
        "Admin",
        "Hospitality",
        "Logistics",
        "Technology",
        "Healthcare",
        "Education",
        "Finance",
        "Other",
      ],
      required: true,
    },
    shiftDetails: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    contactMethods: [
      {
        type: {
          type: String,
          enum: ["whatsapp", "call", "email"],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    salary: {
      type: Number,
      required: true,
    },
    vacancy: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);
jobSchema.index({ vacancy: 1, location: 1, category: 1, createdAt: -1 });
export default mongoose.model("Job", jobSchema);
