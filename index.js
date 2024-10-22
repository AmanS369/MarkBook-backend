import express from "express";
import dotenv from "dotenv";
import morgan from "morgan"; // Correct import statement
import cors from "cors";

import authRoutes from "./Router/authRouter.js";
import bitsRoutes from "./Router/bitsRouter.js"; // Import bitsRouter
import spaceRoutes from "./Router/spaceRouter.js"; // Import spaceRouter
import quickbitROutes from "./Router/QuickBitRouter.js";
import connDB from "./Database/conn.js";
import searchRoutes from "./Router/searchRouter.js";

// Configuration
dotenv.config();

// Database Connection
connDB();

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins but handle when credentials are included
    if (origin || !origin) {
      // Allow all origins
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, auth headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bits", bitsRoutes); // Add route for bits
app.use("/api/v1/spaces", spaceRoutes); // Add route for spaces
app.use("/api/v1/quick-bits", quickbitROutes);
app.use("/api/v1/search", searchRoutes);
// Root route
app.get("/", (req, res) => {
  res.send({});
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
