import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "./cart.controller";
import { validateBody } from "../../middlewares/validateBody";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema";

const router = Router();

router.get("/", authMiddleware, getCart);

router.post("/", authMiddleware, validateBody(addToCartSchema), addToCart);

router.delete("/:id", authMiddleware, removeFromCart);

router.patch(
  "/:id",
  authMiddleware,
  validateBody(updateCartItemSchema),
  updateCartItem,
);

export default router;
