/// <reference types="jest" />

const cartService = require("../../../src/modules/cart/cart.service");
const { getCartService, addToCardService, removeFromCartService, updateCartItemService } = cartService;
import { AppError } from "../../../src/errors/AppError";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Cart Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCartService", () => {
    it("should retrieve cart with items and total price", async () => {
      const userId = "user-123";
      const mockCart = {
        cartItems: [
          {
            id: "item-1",
            productId: "prod-1",
            quantity: 2,
            product: {
              id: "prod-1",
              name: "Product 1",
              price: 50,
            },
          },
          {
            id: "item-2",
            productId: "prod-2",
            quantity: 1,
            product: {
              id: "prod-2",
              name: "Product 2",
              price: 30,
            },
          },
        ],
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);

      const result = await getCartService(userId);

      expect(prisma.cart.findUnique as jest.Mock).toHaveBeenCalledWith({
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

      expect(result).toEqual({
        ...mockCart,
        totalPrices: 130, // (2 * 50) + (1 * 30)
      });
    });

    it("should return cart with zero total price when empty", async () => {
      const userId = "user-456";
      const mockCart = {
        cartItems: [],
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);

      const result = await getCartService(userId);

      expect(result).toEqual({
        ...mockCart,
        totalPrices: 0,
      });
    });

    it("should throw error when cart not found", async () => {
      const userId = "user-789";

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getCartService(userId)).rejects.toThrow(
        new AppError("Cart not found", 404),
      );

      expect(prisma.cart.findUnique as jest.Mock).toHaveBeenCalledWith({
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
    });
  });

  describe("addToCardService", () => {
    it("should add new product to cart", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 2;
      const mockCart = { id: "cart-123" };
      const mockNewCartItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity,
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cartItem.create as jest.Mock).mockResolvedValue(mockNewCartItem);

      const result = await addToCardService(userId, productId, quantity);

      expect(prisma.cart.findUnique as jest.Mock).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(prisma.cartItem.findUnique as jest.Mock).toHaveBeenCalledWith({
        where: {
          cartId_productId: {
            cartId: mockCart.id,
            productId,
          },
        },
      });
      expect(prisma.cartItem.create as jest.Mock).toHaveBeenCalledWith({
        data: {
          cartId: mockCart.id,
          productId,
          quantity,
        },
      });
      expect(result).toEqual(mockNewCartItem);
    });

    it("should update quantity of existing product in cart", async () => {
      const userId = "user-456";
      const productId = "prod-2";
      const quantity = 3;
      const mockCart = { id: "cart-456" };
      const existingCartItem = {
        id: "item-2",
        cartId: "cart-456",
        productId,
        quantity: 2,
      };
      const updatedCartItem = {
        id: "item-2",
        cartId: "cart-456",
        productId,
        quantity: 5, // 2 + 3
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(
        existingCartItem,
      );
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(updatedCartItem);

      const result = await addToCardService(userId, productId, quantity);

      expect(prisma.cartItem.update as jest.Mock).toHaveBeenCalledWith({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      expect(result).toEqual(updatedCartItem);
    });

    it("should throw error when cart not found", async () => {
      const userId = "user-789";
      const productId = "prod-3";
      const quantity = 1;

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        addToCardService(userId, productId, quantity),
      ).rejects.toThrow(new Error("Cart not found for user"));
    });
  });

  describe("removeFromCartService", () => {
    it("should remove product from cart successfully", async () => {
      const productId = "prod-1";
      const userId = "user-123";
      const mockCart = { id: "cart-123" };
      const mockCartItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity: 2,
      };
      const mockDeletedItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity: 2,
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(mockCartItem);
      (prisma.cartItem.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const result = await removeFromCartService(productId, userId);

      expect(prisma.cart.findUnique as jest.Mock).toHaveBeenCalledWith({
        where: { userId },
        select: { id: true },
      });
      expect(prisma.cartItem.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: { cartId: mockCart.id, productId },
      });
      expect(prisma.cartItem.delete as jest.Mock).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
      });
      expect(result).toEqual(mockDeletedItem);
    });

    it("should throw error when cart not found", async () => {
      const productId = "prod-2";
      const userId = "user-456";

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(removeFromCartService(productId, userId)).rejects.toThrow(
        new AppError("Cart not found", 404),
      );
    });

    it("should throw error when product not found in cart", async () => {
      const productId = "prod-3";
      const userId = "user-789";
      const mockCart = { id: "cart-789" };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(removeFromCartService(productId, userId)).rejects.toThrow(
        new AppError("Product not founded in cart", 404),
      );
    });
  });

  describe("updateCartItemService", () => {
    it("should update cart item quantity successfully", async () => {
      const productId = "prod-1";
      const userId = "user-123";
      const quantity = 5;
      const mockCart = { id: "cart-123" };
      const mockCartItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity: 2,
      };
      const mockUpdatedItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity,
      };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(mockCartItem);
      (prisma.cartItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await updateCartItemService(productId, userId, quantity);

      expect(prisma.cart.findUnique as jest.Mock).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(prisma.cartItem.findFirst as jest.Mock).toHaveBeenCalledWith({
        where: { cartId: mockCart.id, productId },
      });
      expect(prisma.cartItem.update as jest.Mock).toHaveBeenCalledWith({
        where: { id: mockCartItem.id },
        data: { quantity },
      });
      expect(result).toEqual(mockUpdatedItem);
    });

    it("should throw error when cart not found", async () => {
      const productId = "prod-2";
      const userId = "user-456";
      const quantity = 3;

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        updateCartItemService(productId, userId, quantity),
      ).rejects.toThrow(new AppError("Cart not found", 404));
    });

    it("should throw error when product not found in cart", async () => {
      const productId = "prod-3";
      const userId = "user-789";
      const quantity = 1;
      const mockCart = { id: "cart-789" };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        updateCartItemService(productId, userId, quantity),
      ).rejects.toThrow(new AppError("Product not founded in cart", 404));
    });
  });
});
