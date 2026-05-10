import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity is required"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().positive("Quantity must be positive"),
});
