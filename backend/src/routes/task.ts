import { Router } from "express";
import { prisma } from "../server";

const router = Router();

// Create Task (Factory)
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, type, checklist = [] } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        type,
        checklist,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task." });
  }
});

// Fetch all Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const {
      title,
      description,
      type,
      dueDate,
      completed,
      checklist = [],
    } = req.body;

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        type,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        checklist, // pass raw JSON
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the task." });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    await prisma.task.delete({ where: { id: taskId } });
    res.status(200).json({ message: `Task with ID ${taskId} deleted` });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the task." });
  }
});

export default router;
