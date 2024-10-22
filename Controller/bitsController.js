import Bits from "../Database/Model/bitsModel.js"; // Adjust the import path as needed
import Space from "../Database/Model/spaceModel.js";

import { getDatabase, ref, set } from "firebase/database";
import admin from "firebase-admin";
import { db } from "../firebaseAdmin.js";
import UserCollection from "../Database/Model/userCollection.js";

export const createBitController = async (req, res) => {
  try {
    const userID = req.user._id;
    const { title, link, description, reminder, spaceId } = req.body;

    console.log(title, link, description, reminder, spaceId);

    // Create and save the new Bit
    const bit = new Bits({
      title,
      link,
      description,
      reminder,
    });
    await bit.save();

    // Find the space document by ID
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).send({
        success: false,
        message: "Space not found",
      });
    }

    // Find the user collection by userID
    const userCollection = await UserCollection.findOne({ userID });
    console.log("this is colelction ID", userCollection);
    if (!userCollection) {
      return res.status(404).send({
        success: false,
        message: "User collection not found",
      });
    }

    // Ensure bitsId is initialized as an array before pushing
    if (!Array.isArray(userCollection.bitsId)) {
      userCollection.bitsId = []; // Initialize bitsId as an empty array if it's not already an array
    }

    // Push the bit into the bits array of both space and userCollection
    space.bits.push(bit);
    userCollection.bitsId.push(bit);

    // Save both the space and userCollection documents
    await space.save();
    await userCollection.save();

    // Initialize the bit in Firebase
    const db = admin.database();
    await db.ref(`bits/${bit._id}`).set({
      content: "",
      lastSaved: new Date().toISOString(),
    });

    res.status(201).send({
      success: true,
      message: "Bit created successfully",
      bit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get a Bit by ID
export const getBitByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user._id;
    const userCollection = UserCollection.find({ userID, bitsId: id });
    const bit = await Bits.findById(id);

    if (!bit && userCollection) {
      return res.status(404).send({
        success: false,
        message: "Bit not found",
      });
    }

    res.status(200).send({
      success: true,
      bit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all Bits
export const getAllBitssController = async (req, res) => {
  try {
    const userID = req.user._id;
    const userCollection = UserCollection.find({ userID, bitsId: id });
    const bits = await Bits.find({});
    res.status(200).send({
      success: true,
      bits,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const getAllBitsController = async (req, res) => {
  try {
    const userID = req.user._id;

    // Fetch the user collection that matches the userID
    const userCollection = await UserCollection.findOne({ userID }).populate(
      "bitsId",
    );

    // Check if user collection exists
    if (!userCollection) {
      return res.status(404).send({
        success: false,
        message: "User collection not found",
      });
    }

    // Get the bits array from the populated user collection
    const bits = userCollection.bitsId; // This will contain populated Bits documents

    res.status(200).send({
      success: true,
      bits, // This will include all bit details
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Update a Bit by ID
export const updatedBitController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, reminder } = req.body;

    const updatedBit = await Bits.findByIdAndUpdate(
      id,
      { title, link, reminder },
      { new: true, runValidators: true },
    );

    if (!updatedBit) {
      return res.status(404).send({
        success: false,
        message: "Bit not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Bit updated successfully",
      bit: updatedBit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Delete a Bit by ID
export const deleteBitController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBit = await Bits.findByIdAndDelete(id);

    if (!deletedBit) {
      return res.status(404).send({
        success: false,
        message: "Bit not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Bit deleted successfully",
      bit: deletedBit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateBitController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, reminder, content } = req.body;

    const updatedBit = await Bits.findByIdAndUpdate(
      id,
      { title, link, reminder, content },
      { new: true, runValidators: true },
    );

    if (!updatedBit) {
      return res.status(404).send({
        success: false,
        message: "Bit not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Bit updated successfully",
      bit: updatedBit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const recentBitController = async (req, res) => {
  try {
  } catch (e) {
    res.send(500).json({
      success: false,
      message: e,
    });
  }
};
