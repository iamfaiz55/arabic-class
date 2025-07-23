import mongoose from 'mongoose';

export interface IDailyEntry extends mongoose.Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  topic: string;
  audioUrl1?: string;
  audioPublicId1?: string;
  audioUrl2?: string;
  audioPublicId2?: string;
  createdAt: Date;
}

const dailyEntrySchema = new mongoose.Schema<IDailyEntry>({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true, default: Date.now },
  topic: { type: String, required: true, trim: true, maxlength: 300 },
  audioUrl1: { type: String, trim: true },
  audioPublicId1: { type: String, trim: true },
  audioUrl2: { type: String, trim: true },
  audioPublicId2: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

dailyEntrySchema.index({ classId: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyEntry>('DailyEntry', dailyEntrySchema);
