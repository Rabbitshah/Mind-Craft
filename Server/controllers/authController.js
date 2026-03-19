import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, setAuthCookie } from "../utils/generateToken.js";

export async function registerUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with that email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "learner",
  });

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(201).json({
    message: "Account created successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.json({
    message: "Signed in successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function logoutUser(req, res) {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully." });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required.");
  }

  res.json({
    message:
      "Password reset flow is scaffolded. Connect email delivery next to send a real reset link.",
  });
}

export async function getCurrentUser(req, res) {
  res.json({ user: req.user });
}
