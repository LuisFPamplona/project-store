/// <reference types="jest" />

import { payOrder } from "../../../src/modules/payment/payment.controller";
import * as paymentService from "../../../src/modules/payment/payment.service";

jest.mock("../../../src/modules/payment/payment.service");

describe("Payment Controller", () => {
  let mockRequest: any;
  let mockResponse: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let nextMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    nextMock = jest.fn();
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  it("calls payOrderService and returns 200", async () => {
    const orderId = "o1";
    mockRequest = { params: { id: orderId }, user: { id: "u1" }, body: { holderName: "A", cardNumber: 1, expirationDate: 1, cvv: 1 } };

    (paymentService.payOrderService as jest.Mock).mockResolvedValue({ id: orderId });

    await payOrder(mockRequest, mockResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { id: orderId }, message: "Payment successfull" });
  });
});
