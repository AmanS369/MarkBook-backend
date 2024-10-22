import mongoose from "mongoose";

const connDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DATABASE);
    console.log("connecteed succ");
  } catch (e) {
    console.log(e);
  }
};
export default connDB;
