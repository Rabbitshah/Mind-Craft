import jwt from "jsonwebtoken";
import User from "../models/User.js";

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  return (
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token
  );
}

async function attachUserFromToken(req, token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "mindcraft-dev-secret");
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  req.user = user;
  return user;
}

export async function protect(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized. Token missing."));
  }

  try {
    await attachUserFromToken(req, token);
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized. Invalid token."));
  }
}

export async function optionalProtect(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    next();
    return;
  }

  try {
    await attachUserFromToken(req, token);
  } catch (error) {
    req.user = null;
  }

  next();
}
