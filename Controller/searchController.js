import Space from "../Database/Model/spaceModel.js";
import Bits from "../Database/Model/bitsModel.js";
import UserCollection from "../Database/Model/userCollection.js";

export const searchController = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user._id; // Assuming you have user authentication middleware

    // Get user's collection
    const userCollection = await UserCollection.findOne({ userID: userId });

    if (!userCollection) {
      return res.status(404).json({
        success: false,
        message: "User collection not found",
      });
    }

    // Create a case-insensitive regex pattern
    const searchRegex = new RegExp(q, "i");

    // Search in user's Spaces
    const spaces = await Space.find({
      _id: { $in: userCollection.spaceID },
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
      ],
    }).select("title description");

    // Search in user's Bits
    const bits = await Bits.find({
      _id: { $in: userCollection.bitsId },
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
      ],
    }).select("title description");

    // Combine and format results
    const results = [
      ...spaces.map((space) => ({
        id: space._id,
        type: "space",
        title: space.title,
        description: space.description,
      })),
      ...bits.map((bit) => ({
        id: bit._id,
        type: "bit",
        title: bit.title,
        description: bit.description,
      })),
    ];

    res.status(200).json({
      success: true,
      results,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
