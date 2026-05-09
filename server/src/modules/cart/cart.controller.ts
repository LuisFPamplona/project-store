import { Request, Response } from "express";
import { getCartService } from "./cart.service";

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const cart = await getCartService(userId);

  return res.json({
    success: true,
    data: cart,
    message: "Cart retrieved successfully",
  });
};
