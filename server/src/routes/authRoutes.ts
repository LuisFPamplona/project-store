import { Router } from "express";
import { login } from "../controllers/authController";
import { validateBody } from "../middlewares/validateBody";
import { loginUserSchema } from "../schemas/auth.schemas";
import {
  updateUserRoleSchema,
  updateUserSchema,
} from "../schemas/user.schemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { changeUserRole } from "../controllers/userController";

const router = Router();

router.post("/", validateBody(loginUserSchema), login);

router.patch("/:id", authMiddleware, validateBody(updateUserSchema));

router.patch(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  validateBody(updateUserRoleSchema),
  changeUserRole,
);

export default router;
