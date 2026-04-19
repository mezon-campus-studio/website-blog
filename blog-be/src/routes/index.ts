import { Router } from 'express';
import authRoutes from './auth.route';
import userRouter from './user.route';

const router = Router();
router.use("/auth", authRoutes)
router.use("/users",userRouter);


export default router;