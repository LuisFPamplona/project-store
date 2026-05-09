import { Request, Response } from "express";
import { roleService } from "./user.service";

export const changeUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const updatedUser = await roleService(id as string, role);

  return res.status(200).json({
    success: true,
    data: updatedUser,
    message: "User role updated successfully",
  });
};
