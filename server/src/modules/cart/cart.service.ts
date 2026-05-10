import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

export const getCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      cartItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const totalPrices =
    cart.cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0) || 0;

  return { ...cart, totalPrices };
};
