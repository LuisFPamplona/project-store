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

  const totalPrices = cart.cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return { ...cart, totalPrices };
};

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

export const removeFromCartService = async (
  productId: string,
  userId: string,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const product = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (!product) {
    throw new AppError("Product not founded in cart", 404);
  }

  const deletedProduct = await prisma.cartItem.delete({
    where: { id: product.id },
  });

  return deletedProduct;
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};

export const updateCartItemService = async (
  productId: string,
  userId: string,
  quantity: number,
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (!cartItem) {
    throw new AppError("Product not founded in cart", 404);
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });

  return updatedItem;
};
