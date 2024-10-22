import User from "../Database/Model/userModel.js";
import Space from "../Database/Model/spaceModel.js";
import Bit from "../Database/Model/bitsModel.js"; // Assuming you have a Bit model
import UserCollection from "../Database/Model/userCollection.js";

export const createQuickBitController = async (req, res) => {
  try {
    const { title, description, link, reminder } = req.body;
    const userID = req.user._id;

    // Find the user and their default space
    const userCollection = await UserCollection.findOne({ userID: userID });
    if (!userCollection) {
      return res.status(404).json({
        success: false,
        message: "User or default space not found",
      });
    }

    // Create the new bit
    const newBit = new Bit({
      title,
      description,
      link,
      reminder,
      space: userCollection.defaultSpace,
    });

    await newBit.save();

    // Add the bit to the default space
    const space = await Space.findByIdAndUpdate(userCollection.defaultSpace, {
      $push: { bits: newBit._id },
    });

    res.status(201).json({
      success: true,
      message: "Quick Bit created successfully",
      bit: newBit,
    });
  } catch (error) {
    console.error("Error creating Quick Bit:", error);
    res.status(500).json({
      success: false,
      message: "Error creating Quick Bit",
    });
  }
};

export const getQuickBitsController = async (req, res) => {
  try {
    const userID = req.user._id;

    // Find the user and their default space
    const userCollection = await UserCollection.findOne({ userID: userID });
    if (!userCollection || !userCollection.defaultSpace) {
      return res.status(404).json({
        success: false,
        message: "User or default space not found",
      });
    }

    // Get all bits from the default space
    const space = await Space.findById(userCollection.defaultSpace).populate(
      "bits",
    );

    res.status(200).json({
      success: true,
      quickBits: space.bits,
    });
  } catch (error) {
    console.error("Error fetching Quick Bits:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Quick Bits",
    });
  }
};
