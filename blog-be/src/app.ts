import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error-handler.middleware';
import { Env } from './config/env.config';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = Env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`, {
    query: req.query,
    body: req.body,
    params: req.params,
  });
  next();
});

app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(cors());


app.use('/api', routes);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;