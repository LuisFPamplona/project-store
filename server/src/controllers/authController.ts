import { Request, Response } from "express";
import { loginService, register } from "../services/authServices";
import { AppError } from "../errors/AppError";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await register(name, email, password);

    return res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginService(email, password);

    res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
      message: "Login successful",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
