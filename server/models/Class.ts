import mongoose from 'mongoose';

export interface IClass extends mongoose.Document {
  name: string;
  location: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const classSchema = new mongoose.Schema<IClass>({
  name: {
    type: String,
    required: [true, 'Please provide a class name'],
    trim: true,
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique class name per user
classSchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model<IClass>('Class', classSchema);