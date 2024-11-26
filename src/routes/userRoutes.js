import express from "express";
import UserController from "../controller/userController.js";
import validatePassword from "../common/authMiddleware.js";

const router = express.Router();

router.post("/userDetails", UserController.createUser);
router.get("/list-leads", validatePassword,UserController.getAllUsers);
// router.put('/send-emails')

export default router;
