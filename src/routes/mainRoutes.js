import express from "express";
import UserRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/send-email", UserRoutes);

export default router;
