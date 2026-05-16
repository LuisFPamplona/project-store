/// <reference types="jest" />

import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
} from "../../../src/modules/orders/orders.service";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("../../../src/modules/cart/cart.service", () => ({
  getCartService: jest.fn(),
}));

import { getCartService } from "../../../src/modules/cart/cart.service";

describe("Orders Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createOrderService", () => {
    it("creates an order from the cart", async () => {
      const userId = "user-1";
      const mockCart = {
        cartItems: [
          { productId: "p1", quantity: 2 },
          { productId: "p2", quantity: 1 },
        ],
        totalPrices: 100,
      } as any;

      (getCartService as jest.Mock).mockResolvedValue(mockCart);

      const mockOrder = { id: "order-1", total: 100, orderItems: [{}, {}] };
      (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await createOrderService(userId);

      expect(getCartService).toHaveBeenCalledWith(userId);
      expect(prisma.order.create).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe("getOrderByIdService", () => {
    it("returns order when found", async () => {
      const id = "order-1";
      const mockOrder = { id };
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const result = await getOrderByIdService(id);

      expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockOrder);
    });
  });

  describe("getOrdersService", () => {
    it("returns orders for a user", async () => {
      const userId = "user-2";
      const mockOrders = [{ id: "o1" }, { id: "o2" }];
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const result = await getOrdersService(userId);

      expect(prisma.order.findMany).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(mockOrders);
    });
  });
});
