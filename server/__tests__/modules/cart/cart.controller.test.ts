/// <reference types="jest" />

import { Request, Response } from "express";
import { getCart } from "../../../src/modules/cart/cart.controller";
import { getCartService } from "../../../src/modules/cart/cart.service";
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/modules/cart/cart.service");

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
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCartData,
        message: "Cart retrieved successfully",
      });
    });
  });
});
