import { AppError } from "../../errors/AppError";
import { OrderStatus } from "../../generated/prisma";
import { prisma } from "../../lib/prisma";
import { clearCart } from "../cart/cart.service";

interface payOrderProps {
  userId: string;
  holderName: string;
  cardNumber: number;
  expirationDate: number;
  cvv: number;
}

export const payOrderService = async (
  id: string,
  { userId, holderName, cardNumber, expirationDate, cvv }: payOrderProps,
) => {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  //na teoria aqui teria uma funçao pra chamar fazer o pagamento, tipo uma chamada pra uma API do ML talvez?

  const data = await prisma.order.update({
    where: { id },
    data: {
      status: OrderStatus.PAID,
    },
    select: {
      id: true,
      total: true,
      status: true,
    },
  });

  await clearCart(userId);

  return data;
};
