import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

export const roleService = async (id: string, role: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("User not found");
  }

  if (user.role === role) {
    throw new AppError("User already has this role");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, role: true },
  });

  return updatedUser;
};
