/// <reference types="jest" />

import { adminMiddleware } from "../../src/middlewares/adminMiddleware";
import { Role } from "../../src/enums/role.enum";

describe("adminMiddleware", () => {
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

  it("returns 403 when user is not admin", () => {
    mockRequest = { user: { role: Role.USER } };

    adminMiddleware(mockRequest as any, mockResponse as any, nextMock as any);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ success: false, message: "Forbidden", user: mockRequest.user });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("calls next when user is admin", () => {
    mockRequest = { user: { role: Role.ADMIN } };

    adminMiddleware(mockRequest as any, mockResponse as any, nextMock as any);

    expect(nextMock).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });
});
