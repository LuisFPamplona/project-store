import { Router } from "express";
import { login } from "./auth.controller";
import { validateBody } from "../../middlewares/validateBody";
import { loginUserSchema } from "./auth.schema";
import { updateUserRoleSchema, updateUserSchema } from "../users/user.schema";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import { changeUserRole } from "../users/user.controller";

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
