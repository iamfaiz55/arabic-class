import asyncHandler from 'express-async-handler';
import multer from 'multer';
import Class from '../models/Class';
import DailyEntry from '../models/DailyEntry';
import { uploadAudio } from '../utils/cloudinary';
import { AuthRequest } from '../middleware/auth';
import {  Response } from 'express';

// Multer configuration for memory storage
// const storage = multer.memoryStorage();
// import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed') as unknown as null, false);
    }
  },
});

export const uploadMiddleware = upload.single('audio');

// @desc    Get all classes for user
// @route   GET /api/classes
// @access  Private
export const getClasses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const classes = await Class.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(classes);
});

// @desc    Create new class
// @route   POST /api/classes
// @access  Private
export const createClass = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, location } = req.body;

  if (!name || !location) {
    res.status(400);
    throw new Error('Please provide class name and location');
  }

  // Check if class name already exists for this user
  const existingClass = await Class.findOne({ 
    name: name.trim(), 
    user: req.user._id 
  });

  if (existingClass) {
    res.status(400);
    throw new Error('Class with this name already exists');
  }

  const newClass = await Class.create({
    name: name.trim(),
    location: location.trim(),
    user: req.user._id,
  });

  res.status(201).json(newClass);
});

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private
export const getClass = asyncHandler(async (req: AuthRequest, res: Response) => {
  const classData = await Class.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  res.json(classData);
});

// @desc    Get daily entries for a class
// @route   GET /api/classes/:id/entries
// @access  Private
export const getDailyEntries = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Verify class belongs to user
  const classData = await Class.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  const entries = await DailyEntry.find({ classId: req.params.id })
    .sort({ date: -1 });

  res.json(entries);
});

// @desc    Create daily entry
// @route   POST /api/classes/:id/entries
// @access  Private
export const createDailyEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, topic } = req.body;
  const audioFile = req.file;

  if (!date || !topic) {
    res.status(400);
    throw new Error('Please provide date and topic');
  }

  // Verify class belongs to user
  const classData = await Class.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  let audioUrl = '';
  let audioPublicId = '';

  // Upload audio if provided
  if (audioFile) {
    if (audioFile.size > 15 * 1024 * 1024) {
      res.status(400);
      throw new Error('Audio file size cannot exceed 15MB');
    }

    try {
      const filename = `${Date.now()}-${req.params.id}`;
      const uploadResult = await uploadAudio(audioFile.buffer, filename) as any;
      audioUrl = uploadResult.secure_url;
      audioPublicId = uploadResult.public_id;
    } catch (error) {
      res.status(500);
      throw new Error('Failed to upload audio file');
    }
  }

  const dailyEntry = await DailyEntry.create({
    classId: req.params.id,
    date: new Date(date),
    topic: topic.trim(),
    audioUrl,
    audioPublicId,
  });

  res.status(201).json(dailyEntry);
});

// @desc    Update daily entry
// @route   PUT /api/classes/:id/entries/:entryId
// @access  Private
export const updateDailyEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { topic } = req.body;

  // Verify class belongs to user
  const classData = await Class.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  const entry = await DailyEntry.findOne({
    _id: req.params.entryId,
    classId: req.params.id,
  });

  if (!entry) {
    res.status(404);
    throw new Error('Daily entry not found');
  }

  if (topic) {
    entry.topic = topic.trim();
  }

  await entry.save();
  res.json(entry);
});

// @desc    Delete daily entry
// @route   DELETE /api/classes/:id/entries/:entryId
// @access  Private
export const deleteDailyEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Verify class belongs to user
  const classData = await Class.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!classData) {
    res.status(404);
    throw new Error('Class not found');
  }

  const entry = await DailyEntry.findOneAndDelete({
    _id: req.params.entryId,
    classId: req.params.id,
  });

  if (!entry) {
    res.status(404);
    throw new Error('Daily entry not found');
  }

  res.json({ message: 'Daily entry deleted successfully' });
});