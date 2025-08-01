import jwt from "jsonwebtoken";

export const ValidateToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "No se envio el header authorization",
      });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No se envio el token",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_KEY || "Mi-keySyperSegura",
      (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .json({ success: false, message: "Token has expired" });
          }
          return res
            .status(401)
            .json({ success: false, message: "Token invalid" });
        }
        req.user = payload;
        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
