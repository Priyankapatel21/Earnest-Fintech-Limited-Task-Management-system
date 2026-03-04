import { prisma } from "../config/prisma";
import { AppError } from "../utils/appError";
import { Prisma } from "@prisma/client";


export const createTask = async (
  userId: string,
  data: { title: string; description?: string; category?: string; dueDate?: string }
) => {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
      category: data.category || "Personal",
      userId,
    },
  });
};

export const getTasks = async (
  userId: string,
  page: number,
  limit: number,
  status?: string,
  search?: string
) => {
  const filters: Prisma.TaskWhereInput = {
    userId,
  };

  if (status !== undefined) {
    filters.status = status === "true";
  }

  if (search) {
    filters.title = {
      contains: search,
    };
  }

  const total = await prisma.task.count({
    where: filters,
  });

  const tasks = await prisma.task.findMany({
    where: filters,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return {
    data: tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const updateTask = async (
  userId: string,
  taskId: string,
  data: { title?: string; description?: string; category?: string; dueDate?: string; status?: boolean }
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new AppError("Task not found", 404);

  const updateData: any = { ...data };
  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new AppError("Task not found", 404);

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};

export const toggleTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new AppError("Task not found", 404);

  return prisma.task.update({
    where: { id: taskId },
    data: { status: !task.status },
  });
};