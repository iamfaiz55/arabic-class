import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

interface Class {
  _id: string;
  name: string;
  location: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DailyEntry {
  _id: string;
  classId: string;
  date: string;
  topic: string;
  audioUrl?: string;
  audioPublicId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateClassRequest {
  name: string;
  location: string;
}

interface CreateDailyEntryRequest {
  date: string;
  topic: string;
  audio?: File;
}

export const classApi = createApi({
  reducerPath: 'classApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/classes',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Class', 'DailyEntry'],
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => '/',
      providesTags: ['Class'],
    }),
    getClass: builder.query<Class, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),
    createClass: builder.mutation<Class, CreateClassRequest>({
      query: (classData) => ({
        url: '/',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation<Class, { id: string; data: CreateClassRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }],
    }),
    deleteClass: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
    getDailyEntries: builder.query<DailyEntry[], string>({
      query: (classId) => `/${classId}/entries`,
      providesTags: (result, error, classId) => [{ type: 'DailyEntry', id: classId }],
    }),
    createDailyEntry: builder.mutation<DailyEntry, { classId: string; data: CreateDailyEntryRequest }>({
      query: ({ classId, data }) => {
        const formData = new FormData();
        formData.append('date', data.date);
        formData.append('topic', data.topic);
        if (data.audio) {
          formData.append('audio', data.audio);
        }
        
        return {
          url: `/${classId}/entries`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { classId }) => [{ type: 'DailyEntry', id: classId }],
    }),
    updateDailyEntry: builder.mutation<DailyEntry, { classId: string; entryId: string; data: CreateDailyEntryRequest }>({
      query: ({ classId, entryId, data }) => {
        const formData = new FormData();
        formData.append('date', data.date);
        formData.append('topic', data.topic);
        if (data.audio) {
          formData.append('audio', data.audio);
        }
        
        return {
          url: `/${classId}/entries/${entryId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { classId }) => [{ type: 'DailyEntry', id: classId }],
    }),
    deleteDailyEntry: builder.mutation<{ message: string }, { classId: string; entryId: string }>({
      query: ({ classId, entryId }) => ({
        url: `/${classId}/entries/${entryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { classId }) => [{ type: 'DailyEntry', id: classId }],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetDailyEntriesQuery,
  useCreateDailyEntryMutation,
  useUpdateDailyEntryMutation,
  useDeleteDailyEntryMutation,
} = classApi;