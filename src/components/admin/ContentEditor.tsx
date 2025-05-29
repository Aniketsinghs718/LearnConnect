'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, Plus, Trash2, Edit3, Eye } from 'lucide-react';

// Validation schemas
const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
});

const topicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type VideoFormData = z.infer<typeof videoSchema>;
type NoteFormData = z.infer<typeof noteSchema>;
type TopicFormData = z.infer<typeof topicSchema>;

interface Video {
  title: string;
  url?: string;
  completed?: boolean;
}

interface Note {
  title: string;
  url: string;
}

interface Topic {
  title: string;
  description: string;
  videos?: Video[];
  notes?: Note[];
}

interface ContentEditorProps {
  topics: Topic[];
  onUpdateTopics: (topics: Topic[]) => void;
}

export default function ContentEditor({ topics, onUpdateTopics }: ContentEditorProps) {
  const [editingTopic, setEditingTopic] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<{ topicIndex: number; videoIndex: number } | null>(null);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

  // Form hooks
  const topicForm = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
  });

  const videoForm = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const addTopic = (data: TopicFormData) => {
    const newTopic: Topic = {
      title: data.title,
      description: data.description,
      videos: [],
      notes: []
    };
    
    onUpdateTopics([...topics, newTopic]);
    topicForm.reset();
    setShowAddTopic(false);
  };

  const updateTopic = (index: number, data: TopicFormData) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      title: data.title,
      description: data.description,
    };
    onUpdateTopics(updatedTopics);
    setEditingTopic(null);
  };

  const deleteTopic = (index: number) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    onUpdateTopics(updatedTopics);
  };

  const addVideo = (topicIndex: number, data: VideoFormData) => {
    const updatedTopics = [...topics];
    if (!updatedTopics[topicIndex].videos) {
      updatedTopics[topicIndex].videos = [];
    }
    updatedTopics[topicIndex].videos!.push({
      title: data.title,
      url: data.url || undefined,
    });
    onUpdateTopics(updatedTopics);
    videoForm.reset();
  };

  const updateVideo = (topicIndex: number, videoIndex: number, data: VideoFormData) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].videos![videoIndex] = {
      title: data.title,
      url: data.url || undefined,
    };
    onUpdateTopics(updatedTopics);
    setEditingVideo(null);
  };

  const deleteVideo = (topicIndex: number, videoIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].videos = updatedTopics[topicIndex].videos?.filter((_, i) => i !== videoIndex);
    onUpdateTopics(updatedTopics);
  };

  const addNote = (topicIndex: number, data: NoteFormData) => {
    const updatedTopics = [...topics];
    if (!updatedTopics[topicIndex].notes) {
      updatedTopics[topicIndex].notes = [];
    }
    updatedTopics[topicIndex].notes!.push(data);
    onUpdateTopics(updatedTopics);
    noteForm.reset();
  };

  const deleteNote = (topicIndex: number, noteIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].notes = updatedTopics[topicIndex].notes?.filter((_, i) => i !== noteIndex);
    onUpdateTopics(updatedTopics);
  };

  const toggleTopicExpansion = (index: number) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTopics(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Add Topic Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Content Editor</h3>
        <button
          onClick={() => setShowAddTopic(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Topic
        </button>
      </div>

      {/* Add Topic Form */}
      {showAddTopic && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
          <h4 className="font-medium mb-4">Add New Topic</h4>
          <form onSubmit={topicForm.handleSubmit(addTopic)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...topicForm.register('title')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter topic title"
              />
              {topicForm.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{topicForm.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...topicForm.register('description')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter topic description"
              />
              {topicForm.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{topicForm.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Topic
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTopic(false);
                  topicForm.reset();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-4">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="bg-white border rounded-lg">
            {/* Topic Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingTopic === topicIndex ? (
                    <form 
                      onSubmit={topicForm.handleSubmit((data) => updateTopic(topicIndex, data))}
                      className="space-y-2"
                    >
                      <input
                        {...topicForm.register('title')}
                        defaultValue={topic.title}
                        className="w-full border rounded px-2 py-1 text-lg font-medium"
                      />
                      <textarea
                        {...topicForm.register('description')}
                        defaultValue={topic.description}
                        className="w-full border rounded px-2 py-1 text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTopic(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h4 className="text-lg font-medium">{topic.title}</h4>
                      <p className="text-gray-600 text-sm">{topic.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>{topic.videos?.length || 0} videos</span>
                        <span>{topic.notes?.length || 0} notes</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTopicExpansion(topicIndex)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingTopic(topicIndex)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteTopic(topicIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Topic Content (Videos & Notes) */}
            {expandedTopics.has(topicIndex) && (
              <div className="p-4 space-y-6">
                {/* Videos Section */}
                <div>
                  <h5 className="font-medium mb-3">Videos</h5>
                  
                  {/* Add Video Form */}
                  <form 
                    onSubmit={videoForm.handleSubmit((data) => addVideo(topicIndex, data))}
                    className="bg-gray-50 p-3 rounded mb-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        {...videoForm.register('title')}
                        placeholder="Video title"
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        {...videoForm.register('url')}
                        placeholder="YouTube embed URL (optional)"
                        className="border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mt-2"
                    >
                      Add Video
                    </button>
                  </form>

                  {/* Videos List */}
                  <div className="space-y-2">
                    {topic.videos?.map((video, videoIndex) => (
                      <div key={videoIndex} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{video.title}</div>
                          {video.url && (
                            <div className="text-xs text-gray-500 truncate">{video.url}</div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingVideo({ topicIndex, videoIndex })}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => deleteVideo(topicIndex, videoIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <h5 className="font-medium mb-3">Notes</h5>
                  
                  {/* Add Note Form */}
                  <form 
                    onSubmit={noteForm.handleSubmit((data) => addNote(topicIndex, data))}
                    className="bg-gray-50 p-3 rounded mb-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        {...noteForm.register('title')}
                        placeholder="Note title"
                        className="border rounded px-2 py-1 text-sm"
                      />
                      <input
                        {...noteForm.register('url')}
                        placeholder="Note URL"
                        className="border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mt-2"
                    >
                      Add Note
                    </button>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2">
                    {topic.notes?.map((note, noteIndex) => (
                      <div key={noteIndex} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{note.title}</div>
                          <div className="text-xs text-gray-500 truncate">{note.url}</div>
                        </div>
                        <button
                          onClick={() => deleteNote(topicIndex, noteIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {topics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No topics added yet. Click "Add Topic" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
