import jwt from "jsonwebtoken";

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "mindcraft-dev-secret", {
    expiresIn: "7d",
  });
}

export function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
