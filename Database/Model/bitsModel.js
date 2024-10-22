// Database/Model/bitsModel.js
import mongoose from "mongoose";

const bitsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
      default: "",
    },
    reminder: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

const Bits = mongoose.model("Bits", bitsSchema);
export default Bits;
