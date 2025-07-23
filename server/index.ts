import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';

import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';
import { configurePassport } from './middleware/auth';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI as string)
// Middleware
app.use(helmet());
app.use(cors({
 origin: ['http://localhost:5173', 'https://334944620a2f.ngrok-free.app', 'https://your-frontend.vercel.app'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true, limit: '16mb' }));

// Passport configuration
configurePassport();
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);


// Database connection

  mongoose.connection.once("open", ()=> {

    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  