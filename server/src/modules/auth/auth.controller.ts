import { Request, Response } from "express";
import { loginService, register } from "./auth.service";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await register(name, email, password);

  return res.status(201).json({
    success: true,
    data: user,
    message: "User created successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { token, user } = await loginService(email, password);

  res.status(200).json({
    success: true,
    data: {
      token,
      user,
    },
    message: "Login successful",
  });
};
