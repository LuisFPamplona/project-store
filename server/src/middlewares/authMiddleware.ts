import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new AppError("Server configuration error", 500);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    (req as any).user = decoded;

    next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};
