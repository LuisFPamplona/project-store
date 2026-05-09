import { Response, Request, NextFunction } from "express";
import { Role } from "../enums/role.enum";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;

  if (user.role !== Role.ADMIN) {
    return res.status(403).json({ success: false, message: "Forbidden", user });
  }

  next();
};
