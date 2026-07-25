import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    number: {
      type: String,

      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student", "employer"],
      required: true,
    },
    studentId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === "student";
      },
    },
    profilePic: {
      type: String,
      default: "default-avatar.png",
    },

    university: {
      type: String,
      default: "",

      required: function () {
        return this.role === "student";
      },
    },
    course: {
      type: String,
      default: "",

      required: function () {
        return this.role === "student";
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },
    companyDescription: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    companyAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
