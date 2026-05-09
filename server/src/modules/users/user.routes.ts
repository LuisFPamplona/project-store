import { Router } from "express";
import { validateBody } from "../../middlewares/validateBody";
import { createUserSchema } from "../auth/auth.schema";
import { createUser } from "../auth/auth.controller";

const router = Router();

router.post("/", validateBody(createUserSchema), createUser);

export default router;
