import express from 'express';
import {
  getClasses,
  createClass,
  getClass,
  getDailyEntries,
  createDailyEntry,
  updateDailyEntry,
  deleteDailyEntry,
  uploadMiddleware,
} from '../controllers/classController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Class routes
router.route('/').get(getClasses).post(createClass);
router.route('/:id').get(getClass);

// Daily entry routes
router.route('/:id/entries').get(getDailyEntries).post(uploadMiddleware, createDailyEntry);
router.route('/:id/entries/:entryId').put(updateDailyEntry).delete(deleteDailyEntry);

export default router;