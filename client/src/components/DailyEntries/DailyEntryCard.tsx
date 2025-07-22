import React from 'react';
import { Calendar, BookOpen, Volume2, Edit, Trash2 } from 'lucide-react';

interface DailyEntry {
  _id: string;
  date: string;
  topic: string;
  audioUrl?: string;
  createdAt: string;
}

interface DailyEntryCardProps {
  entry: DailyEntry;
  onEdit: (entry: DailyEntry) => void;
  onDelete: (id: string) => void;
}

export const DailyEntryCard: React.FC<DailyEntryCardProps> = ({ entry, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{formatDate(entry.date)}</h3>
              <p className="text-sm text-gray-500">
                Added {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(entry)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="Edit entry"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(entry._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Topic</p>
              <p className="text-gray-900">{entry.topic}</p>
            </div>
          </div>
          
          {entry.audioUrl && (
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <Volume2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Audio Recording</p>
                <audio
                  controls
                  className="w-full h-8"
                  style={{ maxWidth: '100%' }}
                >
                  <source src={entry.audioUrl} type="audio/mpeg" />
                  <source src={entry.audioUrl} type="audio/wav" />
                  <source src={entry.audioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};