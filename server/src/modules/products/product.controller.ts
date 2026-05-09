import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  editProductService,
  getProductsService,
} from "./product.service";

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const id = req.query.id as string | undefined;

  const products = await getProductsService(page, limit, id);

  return res.status(200).json({
    success: true,
    data: products,
    message: "Products retrieved successfully",
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  const product = await createProductService(name, description, price);

  return res.status(201).json({
    success: true,
    data: product,
    message: "Product created successfully",
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteProductService(id as string);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const product = await editProductService(
    id as string,
    name,
    description,
    price,
  );

  return res.status(200).json({
    success: true,
    data: product,
    message: "Product edited successfully",
  });
};
