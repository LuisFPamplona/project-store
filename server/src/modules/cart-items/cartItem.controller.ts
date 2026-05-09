import { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { addToCardService } from "./cartItem.service";

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;

  try {
    const cartItem = await addToCardService(userId, productId, quantity);
    return res.status(201).json({
      success: true,
      data: cartItem,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
