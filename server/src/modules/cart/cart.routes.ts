import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getCart } from "./cart.controller";

const router = Router();

router.get("/", authMiddleware, getCart);

export default router;
