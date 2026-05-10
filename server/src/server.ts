import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import productsRoutes from "./modules/products/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import { errorHandler } from "./errors/errorHandler";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/sessions", authRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/cart", cartRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at http://localhost:${PORT}`);
});
