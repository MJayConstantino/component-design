import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import employeeRoutes from "./routes/employee";
import memberRoutes from "./routes/member";

export const app = express();
export const prisma = new PrismaClient();

const PORT = 3001;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello this root route");
});

app.use("/api/employees", employeeRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

