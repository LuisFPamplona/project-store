import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { getCartService } from "./cart.service";

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const cart = await getCartService(userId);

    return res.json({
      success: true,
      data: cart,
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
