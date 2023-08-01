import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  avatar: { type: String, required: true },
});

export default mongoose.model("profile", profileSchema);
