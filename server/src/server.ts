import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productsRoutes from "./routes/productsRoutes";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/sessions", authRoutes);

app.use("/api/products", productsRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at http://localhost:${PORT}`);
});
