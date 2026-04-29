import { Router } from 'express';
import authRoutes from './auth.route';
import userRouter from './user.route';
import postRoutes from './post.route';
import searchRouter from './search.route';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/post', postRoutes);
router.use('/search', searchRouter);

export default router;
