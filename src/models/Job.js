import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    category: {
      type: String,
      enum: ["Supermarket", "Garment", "Shop", "Delivery", "Other"],
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

export default mongoose.model("Job", jobSchema);
