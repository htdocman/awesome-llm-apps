export interface Story {
  id: number;
  title: string;
  description: string;
  genre: string;
  target_word_count: number;
  current_word_count: number;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  story_id: number;
  title: string;
  content: string;
  word_count: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: number;
  story_id: number;
  name: string;
  description: string;
  appearance: string;
  personality: string;
  background: string;
  role: 'main' | 'supporting' | 'antagonist' | 'other';
  created_at: string;
  updated_at: string;
}

export interface PlotPoint {
  id: number;
  story_id: number;
  title: string;
  description: string;
  type: 'event' | 'conflict' | 'resolution' | 'climax' | 'setup';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WritingSession {
  id: number;
  story_id: number;
  words_written: number;
  session_duration: number;
  date: string;
  created_at: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  content: string;
  created_at: string;
}

export interface WritingStats {
  total_words: number;
  total_time: number;
  session_count: number;
  avg_words_per_session: number;
}

export interface CreateStoryData {
  title: string;
  description?: string;
  genre?: string;
  target_word_count?: number;
}

export interface CreateChapterData {
  story_id: number;
  title: string;
  content?: string;
  order_index: number;
}

export interface CreateCharacterData {
  story_id: number;
  name: string;
  description?: string;
  appearance?: string;
  personality?: string;
  background?: string;
  role?: Character['role'];
}

export interface CreatePlotPointData {
  story_id: number;
  title: string;
  description?: string;
  type?: PlotPoint['type'];
  order_index: number;
}

export interface AIPrompt {
  type: 'character' | 'plot' | 'dialogue' | 'description' | 'continue';
  context: string;
  request: string;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
}