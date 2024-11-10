import mongoose from "mongoose";
const userschema = new mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
    },
    password: { type: mongoose.Schema.Types.String, required: true },
  },
  { timestamps: true, versionKey: false }
);
export const User = mongoose.model("User", userschema);
