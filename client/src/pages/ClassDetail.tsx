import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { DailyEntryCard } from '../components/DailyEntries/DailyEntryCard';
import { CreateDailyEntryModal } from '../components/DailyEntries/CreateDailyEntryModal';
import { EditEntryModal } from '../components/DailyEntries/EditEntryModal';
import { useGetClassQuery, useGetDailyEntriesQuery, useDeleteDailyEntryMutation } from '../redux/classApi';

interface DailyEntry {
  _id: string;
  date: string;
  topic: string;
  audioUrl?: string;
  createdAt: string;
}

export const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null);
  
  const { data: classItem, isLoading: classLoading, error: classError } = useGetClassQuery(id!);
  const { data: entries, isLoading: entriesLoading, error: entriesError } = useGetDailyEntriesQuery(id!);
  const [deleteDailyEntry] = useDeleteDailyEntryMutation();

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this daily entry?')) {
      try {
        await deleteDailyEntry({ classId: id!, entryId }).unwrap();
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const handleEditEntry = (entry: DailyEntry) => {
    setEditingEntry(entry);
  };

  if (classLoading || entriesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (classError || entriesError) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading class</h3>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!classItem) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Class not found</h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{classItem.name}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{classItem.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(classItem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Entry</span>
          </button>
        </div>

        {entries && entries.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <DailyEntryCard
                key={entry._id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No daily entries yet</h3>
            <p className="text-gray-600 mb-6">
              Start documenting your class sessions by adding your first daily entry
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Entry</span>
            </button>
          </div>
        )}

        <CreateDailyEntryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          classId={id!}
        />

        <EditEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          classId={id!}
          entry={editingEntry}
        />
      </div>
    </Layout>
  );
};