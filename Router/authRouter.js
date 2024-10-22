import express from "express";
import { requireSign } from "../Middlewares/authMiddle.js";
import {
  loginController,
  logoutController,
  registerController,
} from "../Controller/authController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.get("/user-auth", requireSign, (req, res) => {
  res.status(200).send({ ok: true });
});

// Add a new route to refresh Firebase token if needed
router.post("/refresh-firebase-token", requireSign, async (req, res) => {
  try {
    const firebaseToken = await admin
      .auth()
      .createCustomToken(req.user._id.toString());
    res.status(200).json({ firebaseToken });
  } catch (error) {
    console.error("Error refreshing Firebase token:", error);
    res.status(500).json({ message: "Error refreshing Firebase token" });
  }
});

export default router;
