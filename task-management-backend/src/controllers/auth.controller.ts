import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema, googleAuthSchema ,forgotPasswordSchema, resetPasswordSchema} from "../validations/auth.validation";
import * as authService from "../services/auth.service";
import { AuthRequest } from "../types/auth.types";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.registerUser(validated);
    
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.loginUser(validated);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
      accessToken: result.accessToken, 
      user: result.user 
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = googleAuthSchema.parse(req.body);
    const result = await authService.continueWithGoogle(validated);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
      accessToken: result.accessToken, 
      user: result.user 
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);
    res.json({ 
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user.id;
    await authService.logoutUser(userId);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = forgotPasswordSchema.parse(req.body);
    const result = await authService.requestPasswordReset(validated.email);
    res.json(result); 
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = resetPasswordSchema.parse(req.body);
    const result = await authService.resetUserPassword(validated.token, validated.newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
};