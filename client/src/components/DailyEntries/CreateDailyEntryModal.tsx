import React, { useState, useRef } from 'react';
import { X, Calendar, BookOpen, Mic, MicOff, Upload, Play, Pause } from 'lucide-react';
import { useCreateDailyEntryMutation } from '../../redux/classApi';

interface CreateDailyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

export const CreateDailyEntryModal: React.FC<CreateDailyEntryModalProps> = ({
  isOpen,
  onClose,
  classId,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
const [audioFile1, setAudioFile1] = useState<File | null>(null);
const [audioFile2, setAudioFile2] = useState<File | null>(null);
  // const [isRecording, setIsRecording] = useState(false);
  // const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [createDailyEntry, { isLoading, error }] = useCreateDailyEntryMutation();
  
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
const fileInputRef2 = useRef<HTMLInputElement | null>(null);

  // const startRecording = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     mediaRecorderRef.current = mediaRecorder;
      
  //     const chunks: BlobPart[] = [];
  //     mediaRecorder.ondataavailable = (event) => {
  //       chunks.push(event.data);
  //     };
      
  //     mediaRecorder.onstop = () => {
  //       const blob = new Blob(chunks, { type: 'audio/wav' });
  //       setRecordedBlob(blob);
  //       setAudioFile(new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' }));
  //       stream.getTracks().forEach(track => track.stop());
  //     };
      
  //     mediaRecorder.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error('Error starting recording:', error);
  //     alert('Could not access microphone. Please check permissions.');
  //   }
  // };

  // const stopRecording = () => {
  //   if (mediaRecorderRef.current && isRecording) {
  //     mediaRecorderRef.current.stop();
  //     setIsRecording(false);
  //   }
  // };

  // const playRecording = () => {
  //   if (recordedBlob && audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //       setIsPlaying(false);
  //     } else {
  //       audioRef.current.src = URL.createObjectURL(recordedBlob);
  //       audioRef.current.play();
  //       setIsPlaying(true);
  //     }
  //   }
  // };

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) setAudioFile1(file);
};

const handleFileUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) setAudioFile2(file);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('date', date);
  formData.append('topic', topic);
  if (audioFile1) formData.append('audio1', audioFile1);
  if (audioFile2) formData.append('audio2', audioFile2);

  try {
await createDailyEntry({ classId, data: formData }).unwrap();
    setDate(new Date().toISOString().split('T')[0]);
    setTopic('');
    setAudioFile1(null);
    setAudioFile2(null);
    // setRecordedBlob(null);
    onClose();
  } catch (err) {
    console.error('Failed to create daily entry:', err);
  }
};


const handleClose = () => {
  setDate(new Date().toISOString().split('T')[0]);
  setTopic('');
  setAudioFile1(null);        // reset first audio file
  setAudioFile2(null);        // reset second audio file

  onClose();
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Daily Entry</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="topic"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="What topic was covered in this class?"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Audio Recording Grammer(Optional)
              </label>
              
              <div className="space-y-4">
                {/* Recording Controls */}
               
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        Upload audio file
                      </button>
                      <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">MP3, WAV, OGG up to 15MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {audioFile1 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Selected:</strong> {audioFile1.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {(audioFile1.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    Additional Audio File Dars (Optional)
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
    <div className="text-center">
      <Upload className="mx-auto h-8 w-8 text-gray-400" />
      <button
        type="button"
        onClick={() => fileInputRef2.current?.click()}
        className="text-indigo-600 hover:text-indigo-500 font-medium"
      >
        Upload second audio file
      </button>
      <p className="text-xs text-gray-400 mt-1">MP3, WAV, OGG up to 15MB</p>
    </div>
    <input
      type="file"
      accept="audio/*"
      onChange={handleFileUpload2}
      ref={fileInputRef2}
      className="hidden"
    />
  </div>

  {audioFile2 && (
    <div className="bg-gray-50 p-3 rounded-md mt-2">
      <p className="text-sm text-gray-700">
        <strong>Selected:</strong> {audioFile2.name}
      </p>
      <p className="text-xs text-gray-500">
        Size: {(audioFile2.size / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
  )}
</div>

              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {(error as any)?.data?.message || 'Failed to create daily entry. Please try again.'}
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Entry'}
            </button>
          </div>
        </form>
        
        {/* <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        /> */}
      </div>
    </div>
  );
};