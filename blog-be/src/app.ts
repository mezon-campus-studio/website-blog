import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { Env } from './config/env.config';
import cookieParser from 'cookie-parser';
import passport from 'passport';

const app = express();

const PORT = Env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));

app.use(cookieParser());

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
