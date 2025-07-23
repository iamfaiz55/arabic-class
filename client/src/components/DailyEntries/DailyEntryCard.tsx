import React from 'react';
import { Calendar, BookOpen, Volume2, Edit, Trash2 } from 'lucide-react';

interface DailyEntry {
  _id: string;
  classId: string;
  date: string;
  topic: string;
  audioUrl1?: string;
  audioUrl2?: string;
  createdAt: string;
  updatedAt: string;
}

interface DailyEntryCardProps {
  entry: DailyEntry;
  onEdit: (entry: DailyEntry) => void;
  onDelete: (id: string) => void;
}

export const DailyEntryCard: React.FC<DailyEntryCardProps> = ({ entry, onEdit, onDelete }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{formatDate(entry.date)}</h3>
            <p className="text-sm text-gray-500">Added {new Date(entry.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic */}
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-700">Topic</p>
          <p className="text-sm text-gray-900">{entry.topic}</p>
        </div>
      </div>

      {/* Audio */}
      {(entry.audioUrl1 || entry.audioUrl2) && (
        <div className="space-y-4 pt-3 border-t border-gray-100">
          {entry.audioUrl1 && (
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div className="w-full">
                <p className="text-sm font-medium text-gray-700 mb-1">Audio 1</p>
                <audio controls className="w-full rounded-md bg-gray-100">
                  <source src={entry.audioUrl1} type="audio/mpeg" />
                  <source src={entry.audioUrl1} type="audio/wav" />
                  <source src={entry.audioUrl1} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
          {entry.audioUrl2 && (
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="w-full">
                <p className="text-sm font-medium text-gray-700 mb-1">Audio 2</p>
                <audio controls className="w-full rounded-md bg-gray-100">
                  <source src={entry.audioUrl2} type="audio/mpeg" />
                  <source src={entry.audioUrl2} type="audio/wav" />
                  <source src={entry.audioUrl2} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
