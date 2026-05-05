import express from "express";
import authRoutes from "./routes/authRoutes";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the server at http://localhost:${PORT}`);
});
