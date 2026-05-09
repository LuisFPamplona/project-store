import { prisma } from "../../lib/prisma";

export const addToCardService = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found for user");
  }

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId,
      },
    },
  });

  if (existingCartItem) {
    const updatedCardItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
    return updatedCardItem;
  }

  const newCartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });

  return newCartItem;
};
