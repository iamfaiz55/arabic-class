import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { ClassCard } from '../components/Classes/ClassCard';
import { CreateClassModal } from '../components/Classes/CreateClassModal';
import { useGetClassesQuery, useDeleteClassMutation } from '../redux/classApi';

export const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: classes, isLoading, error } = useGetClassesQuery();
  const [deleteClass] = useDeleteClassMutation();
  const navigate = useNavigate();

  const handleViewClass = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class? This will also delete all daily entries.')) {
      try {
        await deleteClass(classId).unwrap();
      } catch (error) {
        console.error('Failed to delete class:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading classes</h3>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
  <Layout>
  <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your classes and daily entries</p>
      </div>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
      >
        <Plus className="w-5 h-5" />
        <span>New Class</span>
      </button>
    </div>

    {/* Class Grid */}
    {classes && classes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem._id}
            classItem={classItem}
            onView={handleViewClass}
            onDelete={handleDeleteClass}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 px-4">
        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes yet</h3>
        <p className="text-gray-600 text-sm mb-6">
          Get started by creating your first class
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Your First Class</span>
        </button>
      </div>
    )}

    <CreateClassModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
    />
  </div>
</Layout>

  );
};