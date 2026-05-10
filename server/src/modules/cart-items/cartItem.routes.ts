import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "./cartItem.controller";
import { validateBody } from "../../middlewares/validateBody";
import { addToCartSchema, updateCartItemSchema } from "./cartItem.schema";

const router = Router();

router.post("/", authMiddleware, validateBody(addToCartSchema), addToCart);

router.delete("/:id", authMiddleware, removeFromCart);

router.patch(
  "/:id",
  authMiddleware,
  validateBody(updateCartItemSchema),
  updateCartItem,
);

export default router;
