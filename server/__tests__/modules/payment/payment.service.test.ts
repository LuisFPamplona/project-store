/// <reference types="jest" />

import { payOrderService } from "../../../src/modules/payment/payment.service";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../../src/modules/cart/cart.service", () => ({
  clearCart: jest.fn(),
}));

import { clearCart } from "../../../src/modules/cart/cart.service";
import { AppError } from "../../../src/errors/AppError";

describe("Payment Service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("throws when order not found", async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      payOrderService("nonexistent", {
        userId: "u1",
        holderName: "A",
        cardNumber: 1234,
        expirationDate: 1234,
        cvv: 123,
      }),
    ).rejects.toThrow(new AppError("Order not found", 404));
  });

  it("updates order status and clears cart when order exists", async () => {
    const order = { id: "o1" };
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);

    const updated = { id: "o1", total: 100, status: "PAID" };
    (prisma.order.update as jest.Mock).mockResolvedValue(updated);

    const result = await payOrderService("o1", {
      userId: "u1",
      holderName: "A",
      cardNumber: 1234,
      expirationDate: 1234,
      cvv: 123,
    });

    expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id: "o1" } });
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id: "o1" }, data: { status: expect.any(String) }, select: { id: true, total: true, status: true } });
    expect(clearCart).toHaveBeenCalledWith("u1");
    expect(result).toEqual(updated);
  });
});
