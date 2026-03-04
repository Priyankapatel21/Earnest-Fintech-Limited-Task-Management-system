import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", taskController.create);
router.get("/", taskController.getAll);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.remove);
router.patch("/:id/toggle", taskController.toggle);

export default router;