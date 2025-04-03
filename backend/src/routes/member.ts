import { Router } from "express";
import { prisma } from "../server";
import type { Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      groupName,
      role,
      expectedSalary,
      expectedDateOfDefense,
    } = req.body;
    const member = await prisma.member.create({
      data: {
        firstName,
        lastName,
        groupName,
        role,
        expectedSalary,
        expectedDateOfDefense,
      },
    });
    res.status(201).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the member." });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching members." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: Number((req.params.id)) },
    });
    if (!member) {
      res.status(404).json({ error: "Member not found." });
      return
    }
    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the member." });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.id);
    const {
      firstName,
      lastName,
      groupName,
      role,
      expectedSalary,
      expectedDateOfDefense,
    } = req.body;
    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        firstName,
        lastName,
        groupName,
        role,
        expectedSalary,
        expectedDateOfDefense,
      },
    });
    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the member." });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const memberId = parseInt(req.params.id);
    await prisma.member.delete({
      where: { id: memberId },
    });
    res.status(200).json({ message: `Member with ID ${memberId} deleted` });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the member." });
  }
});

export default router;
