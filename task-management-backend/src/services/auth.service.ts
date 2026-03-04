import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/appError";

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  //Generate tokens immediately for auto-login
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return { 
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return { 
    accessToken, 
    refreshToken, 
    user: { id: user.id, name: user.name, email: user.email } 
  };
};

export const continueWithGoogle = async (data: { email: string; name: string; googleId: string }) => {
  let user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: "", 
      },
    });
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

  await prisma.user.update({ 
    where: { id: user.id }, 
    data: { refreshToken } 
  });

  return { 
    accessToken, 
    refreshToken, 
    user: { id: user.id, name: user.name, email: user.email } 
  };
};

export const refreshAccessToken = async (token: string) => {
  if (!token) throw new AppError("Refresh token required", 401);
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };

  const user = await prisma.user.findUnique({ where: { id: decoded.id, refreshToken: token } });
  if (!user) throw new AppError("Invalid refresh token", 403);

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });

  return { 
    accessToken, 
    user: { id: user.id, name: user.name, email: user.email } 
  };
};

export const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  let resetToken = null;

  if (user) {
    resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      process.env.JWT_SECRET as string, 
      { expiresIn: "15m" }
    );
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log("---------------------------------------");
    console.log(`RECRUITER DEBUG LINK FOR ${email}:`);
    console.log(resetLink);
    console.log("---------------------------------------");
  }

  return { 
    message: "Reset link generated successfully.", 
    demoToken: resetToken 
  };
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, type: string };
    if (decoded.type !== "password_reset") {
      throw new AppError("Invalid token type", 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { 
        password: hashedPassword,
        refreshToken: null 
      },
    });
    return { message: "Password updated successfully" };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError("Invalid or expired reset link", 400);
  }
};