import mongoose from 'mongoose';

export interface IDailyEntry extends mongoose.Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  topic: string;
  audioUrl?: string;
  audioPublicId?: string;
  createdAt: Date;
}

const dailyEntrySchema = new mongoose.Schema<IDailyEntry>({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  topic: {
    type: String,
    required: [true, 'Please provide a topic'],
    trim: true,
    maxlength: [300, 'Topic cannot exceed 300 characters']
  },
  audioUrl: {
    type: String,
    trim: true
  },
  audioPublicId: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique date per class
dailyEntrySchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyEntry>('DailyEntry', dailyEntrySchema);