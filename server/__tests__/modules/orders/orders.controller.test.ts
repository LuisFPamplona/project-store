/// <reference types="jest" />

import { createOrder, getOrderById, getOrders } from "../../../src/modules/orders/orders.controller";
import * as ordersService from "../../../src/modules/orders/orders.service";

jest.mock("../../../src/modules/orders/orders.service");

describe("Orders Controller", () => {
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

  it("createOrder should return 201 with created order", async () => {
    const userId = "user-1";
    mockRequest = { user: { id: userId } };

    (ordersService.createOrderService as jest.Mock).mockResolvedValue({ id: "o1" });

    await createOrder(mockRequest, mockResponse);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { id: "o1" }, message: "Order created successfully" });
  });

  it("getOrderById should return 200 with order", async () => {
    const id = "o1";
    mockRequest = { params: { id } };
    (ordersService.getOrderByIdService as jest.Mock).mockResolvedValue({ id });

    await getOrderById(mockRequest, mockResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: { id }, message: "Order retrieved successfully" });
  });

  it("getOrders should return 200 with orders list", async () => {
    const userId = "user-2";
    mockRequest = { user: { id: userId } };
    (ordersService.getOrdersService as jest.Mock).mockResolvedValue([{ id: "o1" }]);

    await getOrders(mockRequest, mockResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true, data: [{ id: "o1" }], message: "Orders retrieved successfully" });
  });
});
