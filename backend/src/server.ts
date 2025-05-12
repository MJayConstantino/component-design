import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import employeeRoutes from "./routes/employee";
import memberRoutes from "./routes/member";
import taskRoutes from "./routes/task";
import checkListRoutes from "./routes/checkList";

export const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;
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
app.use("/api/tasks", taskRoutes);
app.use("/api/checklists", checkListRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { prisma };
