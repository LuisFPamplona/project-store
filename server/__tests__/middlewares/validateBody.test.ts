import { Request, Response } from "express";
import { validateBody } from "../../src/middlewares/validateBody";
import { z } from "zod";

const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

describe("validateBody middleware", () => {
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

  it("should call next if validation succeeds", () => {
    mockRequest = {
      body: {
        name: "John Doe",
        email: "john@example.com",
      },
    };

    const middleware = validateBody(testSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(nextMock).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails", () => {
    mockRequest = {
      body: {
        name: "",
        email: "invalid-email",
      },
    };

    const middleware = validateBody(testSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Name is required",
    });
    expect(nextMock).not.toHaveBeenCalled();
  });
});
