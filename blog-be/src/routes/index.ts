import { Router } from 'express';
import authRoutes from './auth.route';
import userRouter from './user.route';
import postRoutes from './post.route';
import categoryRoutes from './category.route';
import tagRoutes from './tag.route';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/post', postRoutes);
router.use('/category', categoryRoutes);
router.use('/tag', tagRoutes);

export default router;
