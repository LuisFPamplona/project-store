/// <reference types="jest" />

import { Request, Response } from "express";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../../../src/modules/cart-items/cartItem.controller";
import {
  addToCardService,
  removeFromCartService,
  updateCartItemService,
} from "../../../src/modules/cart-items/cartItem.service";
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/modules/cart-items/cartItem.service");

describe("Cart Items Controller", () => {
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

  describe("addToCart", () => {
    it("should add new product to cart successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 2;

      const newCartItem = {
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      (addToCardService as jest.Mock).mockResolvedValue(newCartItem);

      await addToCart(mockRequest as Request, mockResponse as Response);

      expect(addToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: newCartItem,
        message: "Product added to cart successfully",
      });
    });

    it("should increase quantity if product already in cart", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 1;

      const updatedCartItem = {
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity: 3,
      };

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      (addToCardService as jest.Mock).mockResolvedValue(updatedCartItem);

      await addToCart(mockRequest as Request, mockResponse as Response);

      expect(addToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedCartItem,
        message: "Product added to cart successfully",
      });
    });

    it("should handle cart not found error", async () => {
      const userId = "user-789";
      const productId = "prod-1";
      const quantity = 1;

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      (addToCardService as jest.Mock).mockRejectedValue(
        new Error("Cart not found for user"),
      );

      try {
        await addToCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Cart not found for user");
      }

      expect(addToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
    });

    it("should handle multiple product additions", async () => {
      const userId = "user-123";
      const productId = "prod-2";
      const quantity = 5;

      const newCartItem = {
        id: "item-2",
        cartId: "cart-1",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        body: { productId, quantity },
      } as any;

      (addToCardService as jest.Mock).mockResolvedValue(newCartItem);

      await addToCart(mockRequest as Request, mockResponse as Response);

      expect(addToCardService).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: newCartItem,
        message: "Product added to cart successfully",
      });
    });
  });

  describe("removeFromCart", () => {
    it("should remove product from cart successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";

      const removedProduct = {
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity: 2,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      (removeFromCartService as jest.Mock).mockResolvedValue(removedProduct);

      await removeFromCart(mockRequest as Request, mockResponse as Response);

      expect(removeFromCartService).toHaveBeenCalledWith(productId, userId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: removedProduct,
        message: "Product removed from cart successfully",
      });
    });

    it("should handle product not found in cart error", async () => {
      const userId = "user-123";
      const productId = "prod-999";

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      (removeFromCartService as jest.Mock).mockRejectedValue(
        new AppError("Product not founded in cart", 404),
      );

      try {
        await removeFromCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Product not founded in cart");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(removeFromCartService).toHaveBeenCalledWith(productId, userId);
    });

    it("should handle cart not found error", async () => {
      const userId = "user-invalid";
      const productId = "prod-1";

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      (removeFromCartService as jest.Mock).mockRejectedValue(
        new AppError("Cart not found", 404),
      );

      try {
        await removeFromCart(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Cart not found");
      }

      expect(removeFromCartService).toHaveBeenCalledWith(productId, userId);
    });

    it("should handle multiple product removals", async () => {
      const userId = "user-123";
      const productId = "prod-2";

      const removedProduct = {
        id: "item-2",
        cartId: "cart-1",
        productId,
        quantity: 5,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
      } as any;

      (removeFromCartService as jest.Mock).mockResolvedValue(removedProduct);

      await removeFromCart(mockRequest as Request, mockResponse as Response);

      expect(removeFromCartService).toHaveBeenCalledWith(productId, userId);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: removedProduct,
        message: "Product removed from cart successfully",
      });
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity successfully", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 5;

      const updatedItem = {
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      (updateCartItemService as jest.Mock).mockResolvedValue(updatedItem);

      await updateCartItem(mockRequest as Request, mockResponse as Response);

      expect(updateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedItem,
        message: "item updated successfully",
      });
    });

    it("should handle quantity update to 0 or negative", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 0;

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      (updateCartItemService as jest.Mock).mockResolvedValue({
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity,
      });

      await updateCartItem(mockRequest as Request, mockResponse as Response);

      expect(updateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
    });

    it("should handle product not found in cart error", async () => {
      const userId = "user-123";
      const productId = "prod-999";
      const quantity = 3;

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      (updateCartItemService as jest.Mock).mockRejectedValue(
        new AppError("Product not founded in cart", 404),
      );

      try {
        await updateCartItem(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Product not founded in cart");
        expect((error as AppError).statusCode).toBe(404);
      }

      expect(updateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
    });

    it("should handle cart not found error", async () => {
      const userId = "user-invalid";
      const productId = "prod-1";
      const quantity = 2;

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      (updateCartItemService as jest.Mock).mockRejectedValue(
        new AppError("Cart not found", 404),
      );

      try {
        await updateCartItem(mockRequest as Request, mockResponse as Response);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe("Cart not found");
      }

      expect(updateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
    });

    it("should update cart item to high quantity", async () => {
      const userId = "user-123";
      const productId = "prod-1";
      const quantity = 100;

      const updatedItem = {
        id: "item-1",
        cartId: "cart-1",
        productId,
        quantity,
      };

      mockRequest = {
        user: { id: userId },
        params: { id: productId },
        body: { quantity },
      } as any;

      (updateCartItemService as jest.Mock).mockResolvedValue(updatedItem);

      await updateCartItem(mockRequest as Request, mockResponse as Response);

      expect(updateCartItemService).toHaveBeenCalledWith(
        productId,
        userId,
        quantity,
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedItem,
        message: "item updated successfully",
      });
    });
  });
});
