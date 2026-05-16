/// <reference types="jest" />

import { Request, Response } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../../../src/modules/cart/cart.controller";
const cartService = require("../../../src/modules/cart/cart.service");
const { getCartService, addToCardService, removeFromCartService, updateCartItemService } = cartService;
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/modules/cart/cart.service");

const mockGetCartService = getCartService as jest.Mock;
const mockAddToCardService = addToCardService as jest.Mock;
const mockRemoveFromCartService = removeFromCartService as jest.Mock;
const mockUpdateCartItemService = updateCartItemService as jest.Mock;

describe("Cart Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe("getCart", () => {
    it("should retrieve cart successfully", async () => {
      const userId = "user-123";
      const mockCartData = {
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
        totalPrices: 130,
      };

      mockRequest = {
        user: { id: userId },
      } as any;

      (getCartService as jest.Mock).mockResolvedValue(mockCartData);

      await getCart(mockRequest as Request, mockResponse as Response);

      expect(getCartService).toHaveBeenCalledWith(userId);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCartData,
        message: "Cart retrieved successfully",
      });
    });

    it("should return empty cart when no items", async () => {
      const userId = "user-456";
      const mockCartData = {
        cartItems: [],
        totalPrices: 0,
      };

      mockRequest = {
        user: { id: userId },
      } as any;

      (getCartService as jest.Mock).mockResolvedValue(mockCartData);

      await getCart(mockRequest as Request, mockResponse as Response);

      expect(getCartService).toHaveBeenCalledWith(userId);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCartData,
        message: "Cart retrieved successfully",
      });
    });

    it("should handle cart not found error", async () => {
      const userId = "user-789";

      mockRequest = {
        user: { id: userId },
      } as any;

      (getCartService as jest.Mock).mockRejectedValue(
        new AppError("Cart not found", 404),
      );

      try {
        await getCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Cart not found");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(getCartService).toHaveBeenCalledWith(userId);
    });

    it("should handle multiple items with different quantities", async () => {
      const userId = "user-multi";
      const mockCartData = {
        cartItems: [
          {
            id: "item-1",
            productId: "prod-1",
            quantity: 5,
            product: {
              id: "prod-1",
              name: "Product 1",
              price: 25,
            },
          },
          {
            id: "item-2",
            productId: "prod-2",
            quantity: 3,
            product: {
              id: "prod-2",
              name: "Product 2",
              price: 40,
            },
          },
          {
            id: "item-3",
            productId: "prod-3",
            quantity: 2,
            product: {
              id: "prod-3",
              name: "Product 3",
              price: 15,
            },
          },
        ],
        totalPrices: 305,
      };

      mockRequest = {
        user: { id: userId },
      } as any;

      (getCartService as jest.Mock).mockResolvedValue(mockCartData);

      await getCart(mockRequest as Request, mockResponse as Response);

      expect(getCartService).toHaveBeenCalledWith(userId);
    });
  });

  describe("addToCart", () => {
    it("should add product to cart successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 2;
      const mockCartItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      mockAddToCardService.mockResolvedValue(mockCartItem);

      await addToCart(mockRequest as Request, mockResponse as Response);

      expect(mockAddToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCartItem,
        message: "Product added to cart successfully",
      });
    });

    it("should handle adding existing product (quantity update)", async () => {
      const userId = "user-456";
      const productId = "prod-2";
      const quantity = 3;
      const mockUpdatedCartItem = {
        id: "item-2",
        cartId: "cart-456",
        productId,
        quantity: 5, // existing 2 + new 3
      };

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      mockAddToCardService.mockResolvedValue(mockUpdatedCartItem);

      await addToCart(mockRequest as Request, mockResponse as Response);

      expect(mockAddToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedCartItem,
        message: "Product added to cart successfully",
      });
    });

    it("should handle cart not found error", async () => {
      const userId = "user-789";
      const productId = "prod-3";
      const quantity = 1;

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      mockAddToCardService.mockRejectedValue(
        new Error("Cart not found for user"),
      );

      try {
        await addToCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Cart not found for user");
      }

      expect(mockAddToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
    });
  });

  describe("removeFromCart", () => {
    it("should remove product from cart successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const mockDeletedItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity: 2,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      mockRemoveFromCartService.mockResolvedValue(mockDeletedItem);

      await removeFromCart(mockRequest as Request, mockResponse as Response);

      expect(mockRemoveFromCartService).toHaveBeenCalledWith(productId, userId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockDeletedItem,
        message: "Product removed from cart successfully",
      });
    });

    it("should handle cart not found error", async () => {
      const userId = "user-456";
      const productId = "prod-2";

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      mockRemoveFromCartService.mockRejectedValue(
        new AppError("Cart not found", 404),
      );

      try {
        await removeFromCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Cart not found");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(mockRemoveFromCartService).toHaveBeenCalledWith(productId, userId);
    });

    it("should handle product not found in cart error", async () => {
      const userId = "user-789";
      const productId = "prod-3";

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      mockRemoveFromCartService.mockRejectedValue(
        new AppError("Product not founded in cart", 404),
      );

      try {
        await removeFromCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Product not founded in cart");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(mockRemoveFromCartService).toHaveBeenCalledWith(productId, userId);
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 5;
      const mockUpdatedItem = {
        id: "item-1",
        cartId: "cart-123",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      mockUpdateCartItemService.mockResolvedValue(mockUpdatedItem);

      await updateCartItem(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedItem,
        message: "item updated successfully",
      });
    });

    it("should handle cart not found error", async () => {
      const userId = "user-456";
      const productId = "prod-2";
      const quantity = 3;

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      mockUpdateCartItemService.mockRejectedValue(
        new AppError("Cart not found", 404),
      );

      try {
        await updateCartItem(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Cart not found");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(mockUpdateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
    });

    it("should handle product not found in cart error", async () => {
      const userId = "user-789";
      const productId = "prod-3";
      const quantity = 1;

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      mockUpdateCartItemService.mockRejectedValue(
        new AppError("Product not founded in cart", 404),
      );

      try {
        await updateCartItem(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Product not founded in cart");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(mockUpdateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
    });
  });
});
