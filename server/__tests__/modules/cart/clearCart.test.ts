/// <reference types="jest" />

import { clearCart } from "../../../src/modules/cart/cart.service";
import { AppError } from "../../../src/errors/AppError";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    cart: {
      findUnique: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
  },
}));

describe("clearCart", () => {
  beforeEach(() => jest.clearAllMocks());

  it("clears cart items when cart exists", async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: "cart-1" });

    await clearCart("user-1");

    expect(prisma.cart.findUnique).toHaveBeenCalledWith({ where: { userId: "user-1" } });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart-1" } });
  });

  it("throws when cart not found", async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(clearCart("user-x")).rejects.toThrow(new AppError("Cart not found", 404));
  });
});
