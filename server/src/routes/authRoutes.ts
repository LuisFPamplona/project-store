import { Router } from "express";
import { createUser, login } from "../controllers/authController";

const router = Router();

router.post("/users", login);

router.post("/sessions", createUser);

export default router;
