import { Request, Response } from "express";
import {
  addToCardService,
  getCartService,
  removeFromCartService,
  updateCartItemService,
} from "./cart.service";

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const cart = await getCartService(userId);

  return res.json({
    success: true,
    data: cart,
    message: "Cart retrieved successfully",
  });
};

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

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productId = req.params.id;

  const removedProduct = await removeFromCartService(
    productId as string,
    userId,
  );

  return res.status(200).json({
    success: true,
    data: removedProduct,
    message: "Product removed from cart successfully",
  });
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const productId = req.params.id;
  const { quantity } = req.body;

  const updatedItem = await updateCartItemService(
    productId as string,
    userId,
    quantity,
  );

  return res.status(200).json({
    success: true,
    data: updatedItem,
    message: "item updated successfully",
  });
};
