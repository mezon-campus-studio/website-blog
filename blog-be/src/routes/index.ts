import { Router } from 'express';
import authRoutes from './auth.route';
import userRouter from './user.route';
import postRoutes from './post.route';
import searchRouter from './search.route';
import categoryRoutes from './category.route';
import tagRoutes from './tag.route';
import adminRouter from './admin.route';
import reportRouter from './report.route';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/post', postRoutes);
router.use('/search', searchRouter);
router.use('/category', categoryRoutes);
router.use('/tag', tagRoutes);
router.use('/admin', adminRouter);
router.use('/report', reportRouter);

export default router;
