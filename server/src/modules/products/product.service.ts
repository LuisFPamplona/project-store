import { prisma } from "../../lib/prisma";

export const getProductsService = async (
  page: number,
  limit: number,
  id?: string,
) => {
  const selectFields = id
    ? {
        id: true,
        name: true,
        description: true,
        price: true,
      }
    : {
        id: true,
        name: true,
        price: true,
      };

  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: id ? { id } : {},
    select: selectFields,
  });

  if (products.length === 0) {
    throw new Error("No products found");
  }

  return products;
};

export const createProductService = async (
  name: string,
  description: string,
  price: number,
) => {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
    },
  });

  return product;
};

export const deleteProductService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  return deletedProduct;
};

export const editProductService = async (
  id: string,
  name: string | undefined,
  description: string | undefined,
  price: number | undefined,
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!name && !description && !price) {
    throw new Error("At least one field must be provided for update");
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
    },
  });

  return updatedProduct;
};
