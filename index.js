import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client')));

app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) {
        if (req.headers['content-type'] === 'application/json') {
            next();
        } else {
            return res.status(415).send({ error: 'Error 415. Unsupported Media Type.' });
        }
    } else {
        next();
    }
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

connectDB();
