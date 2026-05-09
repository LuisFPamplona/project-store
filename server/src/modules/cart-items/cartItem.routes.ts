import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { addToCart } from "./cartItem.controller";
import { validateBody } from "../../middlewares/validateBody";
import { addToCartSchema } from "./cartItem.schema";

const router = Router();

router.post("/", authMiddleware, validateBody(addToCartSchema), addToCart);

export default router;
