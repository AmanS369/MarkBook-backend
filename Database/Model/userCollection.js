import mongoose from "mongoose";

const userCollectionSchemea = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    spaceID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
      },
    ],
    defaultSpace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
    },
    bitsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bits",
      },
    ],
  },
  { timestamps: true },
);

const UserCollection = mongoose.model("UserCollection", userCollectionSchemea);
export default UserCollection;
