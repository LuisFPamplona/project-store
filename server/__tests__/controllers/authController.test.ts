/// <reference types="jest" />

import { Request, Response } from "express";
import { createUser, login } from "../../src/controllers/authController";
import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  genSaltSync: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth Controller", () => {
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

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      mockRequest = {
        body: userData,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSaltSync as jest.Mock).mockReturnValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-id",
        name: userData.name,
        email: userData.email,
      });

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, "salt");
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: "hashedPassword",
        },
        select: { id: true, name: true, email: true },
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: "user-id",
          name: userData.name,
          email: userData.email,
        },
        message: "User created successfully",
      });
    });

    it("should return 400 if user already exists", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      mockRequest = {
        body: userData,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-id",
      });

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "User already exists",
      });
    });

    it("should return 500 on internal error", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      mockRequest = {
        body: userData,
      };

      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const loginData = {
        email: "john@example.com",
        password: "password123",
      };

      mockRequest = {
        body: loginData,
      };

      const mockUser = {
        id: "user-id",
        name: "John Doe",
        email: loginData.email,
        password: "hashedPassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      await login(mockRequest as Request, mockResponse as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email },
        expect.any(String), // Assuming JWT_SECRET is set
        { expiresIn: expect.any(String) },
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          token: "mock-token",
          user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
        },
        message: "Login successful",
      });
    });

    it("should return 401 if user not found", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      mockRequest = {
        body: loginData,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      const loginData = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      mockRequest = {
        body: loginData,
      };

      const mockUser = {
        id: "user-id",
        email: loginData.email,
        password: "hashedPassword",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return 500 on internal error", async () => {
      const loginData = {
        email: "john@example.com",
        password: "password123",
      };

      mockRequest = {
        body: loginData,
      };

      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
