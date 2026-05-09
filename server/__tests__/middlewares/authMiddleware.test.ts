import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../src/middlewares/authMiddleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("authMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
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

  it("should return 401 if no authorization header", () => {
    mockRequest = {
      headers: {},
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "No token provided",
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header does not have Bearer", () => {
    mockRequest = {
      headers: {
        authorization: "invalidtoken",
      },
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    mockRequest = {
      headers: {
        authorization: "Bearer invalidtoken",
      },
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should call next and set req.user if token is valid", () => {
    const decodedUser = { id: "user-id", email: "user@example.com" };
    mockRequest = {
      headers: {
        authorization: "Bearer validtoken",
      },
    };

    (jwt.verify as jest.Mock).mockReturnValue(decodedUser);

    authMiddleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validtoken",
      process.env.JWT_SECRET,
    );
    expect((mockRequest as any).user).toEqual(decodedUser);
    expect(nextMock).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });
});
