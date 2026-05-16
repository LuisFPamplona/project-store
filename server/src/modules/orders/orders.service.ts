import { prisma } from "../../lib/prisma";
import { getCartService } from "../cart/cart.service";

export const createOrderService = async (userId: string) => {
  const cart = await getCartService(userId);

  const order = await prisma.order.create({
    data: {
      userId,
      total: cart.totalPrices,

      orderItems: {
        create: cart.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  return order;
};

export const getOrderByIdService = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  return order;
};

export const getOrdersService = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
  });

  return orders;
};
