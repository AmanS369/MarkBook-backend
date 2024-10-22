import User from "../Database/Model/userModel.js"; // Import your User model
import bcrypt from "bcryptjs"; // Assuming you're using bcrypt for password hashing

export const verifyPassword = async (req, res, next) => {
  try {
    // Get the user from the request (assuming user is added to req by requireSign middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    const { password } = req.body; // Password to verify is expected in the request body

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required for verification.",
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).send({
        success: false,
        message: "Password is incorrect.",
      });
    }

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error during password verification.",
    });
  }
};
