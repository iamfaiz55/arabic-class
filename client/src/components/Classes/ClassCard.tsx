import React from 'react';
import { MapPin, Calendar, Trash2, Edit } from 'lucide-react';

interface Class {
  _id: string;
  name: string;
  location: string;
  createdAt: string;
}

interface ClassCardProps {
  classItem: Class;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classItem, onView, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{classItem.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(classItem._id)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="View class"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(classItem._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete class"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{classItem.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Created {formatDate(classItem.createdAt)}</span>
          </div>
        </div>
        
        <button
          onClick={() => onView(classItem._id)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-medium"
        >
          View Daily Entries
        </button>
      </div>
    </div>
  );
};