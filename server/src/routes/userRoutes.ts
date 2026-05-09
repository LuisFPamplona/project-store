import { Router } from "express";
import { validateBody } from "../middlewares/validateBody";
import { createUserSchema } from "../schemas/auth.schemas";
import { createUser } from "../controllers/authController";

const router = Router();

router.post("/", validateBody(createUserSchema), createUser);

export default router;
