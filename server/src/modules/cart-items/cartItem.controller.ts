import { Request, Response } from "express";
import { addToCardService } from "./cartItem.service";

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;

  const cartItem = await addToCardService(userId, productId, quantity);
  return res.status(201).json({
    success: true,
    data: cartItem,
    message: "Product added to cart successfully",
  });
};
