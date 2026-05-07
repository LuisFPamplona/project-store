import { Router } from "express";
import { createUser, login } from "../controllers/authController";
import { validateBody } from "../middlewares/validateBody";
import { createUserSchema, loginUserSchema } from "../schemas/auth.schemas";

const router = Router();

router.post("/users", validateBody(createUserSchema), createUser);

router.post("/sessions", validateBody(loginUserSchema), login);

export default router;
