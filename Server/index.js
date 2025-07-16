import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Tutorly API Running...'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
