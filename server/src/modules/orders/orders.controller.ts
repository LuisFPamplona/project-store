import { Request, Response } from "express";
import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
} from "./orders.service";

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const order = await createOrderService(userId);

  res.status(201).json({
    success: true,
    data: order,
    message: "Order created successfully",
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await getOrderByIdService(id as string);

  res.status(200).json({
    success: true,
    data: order,
    message: "Order retrieved successfully",
  });
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const orders = await getOrdersService(userId);

  return res.status(200).json({
    success: true,
    data: orders,
    message: "Orders retrieved successfully",
  });
};
