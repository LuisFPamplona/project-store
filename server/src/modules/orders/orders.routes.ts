import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createOrder, getOrderById, getOrders } from "./orders.controller";

const router = Router();

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, getOrders);

router.get("/:id", authMiddleware, getOrderById);

export default router;
