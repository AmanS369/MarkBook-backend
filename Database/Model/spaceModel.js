import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },

    bits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bits",
      },
    ],
  },
  { timestamps: true },
);

const Space = mongoose.model("Space", spaceSchema);
export default Space;
