// 1. Create Space and Save Instance in User
import User from "../Database/Model/userModel.js";
import Space from "../Database/Model/spaceModel.js";
import UserCollection from "../Database/Model/userCollection.js";
export const createSpaceController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userID = req.user._id; // Get user ID from token

    // Check if the user already has a space with the same title
    const ex_space = await Space.findOne({ title, owner: userID });
    if (ex_space) {
      return res.status(400).json({
        success: false,
        message: "Space with the same title already exists",
      });
    }

    // Create new space
    const space = new Space({
      title,
      description,
      owner: userID,
    });

    await space.save();

    // Update the user's document
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { $push: { spaceID: space._id } },
    //   { new: true },
    // );

    const userCollection = await UserCollection.findOne({ userID: userID }); // Assuming userID is defined

    if (userCollection) {
      userCollection.spaceID.push(space._id);
      await userCollection.save(); // Save the changes
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      console.error("User collection not found.");
    }
    res.status(201).json({
      success: true,
      message: "Space created successfully",
      space,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// 2. Get All Spaces for the User by Populating spaceID
export const getAllSpacesController = async (req, res) => {
  try {
    const userID = req.user._id;

    // Fetch user and populate space details, including the default space
    const userCollections = await UserCollection.find({ userID: userID })
      .populate({
        path: "spaceID",
        select: "title description",
      })
      .populate({
        path: "defaultSpace",
        select: "title description",
      });

    if (!userCollections || userCollections.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Access the first (and likely only) user collection
    const userCollection = userCollections[0];

    //console.log(userCollection.spaceID);

    // Prepare the response with the default space highlighted
    const spaces = (userCollection.spaceID || []).map((space) => ({
      ...space.toObject(),
      isDefault: space._id.equals(userCollection.defaultSpace._id),
    }));
    spaces.unshift(userCollection.defaultSpace);
    res.status(200).json({
      success: true,
      defaultSpace: userCollection.defaultSpace,
      spaces: spaces,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// 3. Update Space and Modify User's spaceID Array
export const updateSpaceController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    // Find and update the space
    const space = await Space.findOneAndUpdate(
      { _id: id, owner: userId }, // Ensure user is the owner
      { title, description },
      { new: true, runValidators: true },
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found or you don't have access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Space updated successfully",
      space,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// 4. Delete Space and Remove From User's spaceID Array
export const deleteSpaceController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the space by ID and owner
    const space = await Space.findOneAndDelete({ _id: id, owner: userId });

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found or you don't have access",
      });
    }

    // Remove space from the user's spaceID array
    await User.findByIdAndUpdate(userId, { $pull: { spaceID: id } });

    res.status(200).json({
      success: true,
      message: "Space deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const OLDgetSpaceByIdController = async (req, res) => {
  try {
    const { id } = req.params; // Space ID from request parameters
    const userID = req.user._id; // User ID from token

    // First, confirm that the user has access to the space
    const userCollection = await UserCollection.find({ userID: userID });

    // Check if the space exists in the user's spaceID array
    const hasSpace = userCollection.spaceID.includes(id);

    if (!hasSpace) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this space",
      });
    }

    // Find space by ID and populate bits field
    const space = await Space.findById(id).populate({
      path: "bits",
      select: "title description", // Populate bits with specific fields
    });

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found",
      });
    }

    res.status(200).json({
      success: true,
      space, // Return space populated with bits
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getSpaceByIdController = async (req, res) => {
  try {
    const { id } = req.params; // Space ID from request parameters
    const userID = req.user._id; // User ID from token

    // Find the user's collection
    const userCollection = await UserCollection.findOne({ userID });

    // Ensure userCollection exists and has spaceID array
    if (!userCollection || !userCollection.spaceID) {
      return res.status(403).json({
        success: false,
        message: "User collection not found or no spaces available",
      });
    }

    // Check if the space exists in the user's spaceID array
    const hasSpace =
      userCollection.spaceID.includes(id) || userCollection.defaultSpace._id;

    if (!hasSpace) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this space",
      });
    }

    // Find space by ID and populate bits field
    const space = await Space.findById(id).populate({
      path: "bits",
      select: "title description", // Populate bits with specific fields
    });

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found",
      });
    }

    res.status(200).json({
      success: true,
      space, // Return space populated with bits
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
