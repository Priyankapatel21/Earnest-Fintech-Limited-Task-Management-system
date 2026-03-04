import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/task.validation";
import { AuthRequest } from "../types/auth.types";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createTaskSchema.parse(req.body);

    const userId = (req as AuthRequest).user.id;

    const task = await taskService.createTask(userId, validated);

    res.status(201).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await taskService.getTasks(
      userId,
      page,
      limit,
      status,
      search
    );

    res.json({
      status: "success",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = updateTaskSchema.parse(req.body);

    const userId = (req as AuthRequest).user.id;
    const taskId = req.params.id as string;

    const task = await taskService.updateTask(
      userId,
      taskId,
      validated
    );

    res.json({
      status: "success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const taskId = req.params.id as string;

    const result = await taskService.deleteTask(userId, taskId);

    res.json({
      status: "success",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const toggle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const taskId = req.params.id as string;

    const task = await taskService.toggleTask(userId, taskId);

    res.json({
      status: "success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};