import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { validateBody } from "../middlewares/validateBody";
import {
  createProductSchema,
  editProductSchema,
} from "../schemas/product.schema";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../controllers/productsController";

const router = Router();

router.get("/", getProducts);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateBody(createProductSchema),
  createProduct,
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateBody(editProductSchema),
  editProduct,
);

export default router;
