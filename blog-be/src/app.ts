import express, { Request, Response } from 'express';
import cors from 'cors';

import routes from './routes';

import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// test route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.use(errorMiddleware);

export default app;