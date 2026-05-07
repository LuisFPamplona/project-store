import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: parsedBody.error.issues[0].message,
      });
    }

    req.body = parsedBody.data;
    next();
  };
};
