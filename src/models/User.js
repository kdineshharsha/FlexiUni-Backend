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
    studentId: {
      type: String,
      trim: true,
      unique: true,
      required: function () {
        return this.role === "student";
      },
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
    profilePic: {
      type: String,
      default: "default-avatar.png",
    },

    university: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
