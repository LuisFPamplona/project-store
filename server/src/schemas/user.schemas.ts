import { z } from "zod";
import { Role } from "../enums/role.enum";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters long")
    .optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum([Role.USER, Role.ADMIN], "Role must be either USER or ADMIN"),
});
