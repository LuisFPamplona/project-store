/// <reference types="jest" />

import { Request, Response } from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  editProduct,
} from "../../../src/modules/products/product.controller";
import { prisma } from "../../../src/lib/prisma";
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("Product Controller", () => {
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
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should retrieve products successfully", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1", price: 10 },
        { id: "2", name: "Product 2", price: 20 },
      ];

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      mockRequest = {
        query: { page: "1", limit: "10" },
      };

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        select: {
          id: true,
          name: true,
          price: true,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
        message: "Products retrieved successfully",
      });
    });

    it("should retrieve a specific product by id", async () => {
      const mockProduct = {
        id: "1",
        name: "Product 1",
        description: "Description",
        price: 10,
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

      mockRequest = {
        query: { id: "1" },
      };

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { id: "1" },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should return 500 on internal server error", async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      mockRequest = {
        query: {},
      };

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });

    it("should return error when no products found", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      mockRequest = {
        query: {},
      };

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const mockProduct = {
        id: "1",
        name: "New Product",
        description: "Description",
        price: 15,
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      mockRequest = {
        body: {
          name: "New Product",
          description: "Description",
          price: 15,
        },
      };

      await createProduct(mockRequest as Request, mockResponse as Response);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "New Product",
          description: "Description",
          price: 15,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: "Product created successfully",
      });
    });

    it("should return 500 on internal server error", async () => {
      (prisma.product.create as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      mockRequest = {
        body: {
          name: "New Product",
          description: "Description",
          price: 15,
        },
      };

      await createProduct(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      const mockProduct = {
        id: "1",
        name: "Product 1",
        description: "Description",
        price: 10,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      mockRequest = {
        params: { id: "1" },
      };

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted successfully",
      });
    });

    it("should return error when product not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: "1" },
      };

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("editProduct", () => {
    it("should edit a product successfully", async () => {
      const mockProduct = {
        id: "1",
        name: "Product 1",
        description: "Description",
        price: 10,
      };

      const updatedProduct = {
        id: "1",
        name: "Updated Product",
        description: "Updated Description",
        price: 20,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

      mockRequest = {
        params: { id: "1" },
        body: {
          name: "Updated Product",
          description: "Updated Description",
          price: 20,
        },
      };

      await editProduct(mockRequest as Request, mockResponse as Response);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Updated Product",
          description: "Updated Description",
          price: 20,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: updatedProduct,
        message: "Product edited successfully",
      });
    });

    it("should return error when product not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: "1" },
        body: {
          name: "Updated Product",
        },
      };

      await editProduct(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });

    it("should return error when no fields provided", async () => {
      const mockProduct = {
        id: "1",
        name: "Product 1",
        description: "Description",
        price: 10,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      mockRequest = {
        params: { id: "1" },
        body: {},
      };

      await editProduct(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
