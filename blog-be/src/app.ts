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

app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors({
  origin: [Env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[],
  credentials: true,
}));

app.use('/api', routes);

app.use(errorHandler);

import { initSocket } from './websocket/socket';

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initSocket(server);

export default app;
