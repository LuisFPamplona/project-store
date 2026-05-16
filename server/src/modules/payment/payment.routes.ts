import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateBody } from "../../middlewares/validateBody";
import { paymentCardSchema } from "./payment.schema";
import { payOrder } from "./payment.controller";

const router = Router();

router.post("/:id", authMiddleware, validateBody(paymentCardSchema), payOrder);

export default router;
