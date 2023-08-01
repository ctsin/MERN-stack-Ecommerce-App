import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { data: Buffer, contentType: String },
});

export default mongoose.model("product", productSchema);
