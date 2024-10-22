import JWT from "jsonwebtoken";

export const requireSign = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const decode = JWT.verify(token, process.env.SECRET);
    req.user = decode;
    next();
  } catch (e) {
    console.log(e);
    if (e instanceof JWT.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};
