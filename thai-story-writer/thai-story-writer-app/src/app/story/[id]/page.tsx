'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Edit, 
  Users, 
  Lightbulb, 
  BarChart3, 
  Download, 
  ArrowLeft,
  Settings,
  Plus,
  FileText,
  Bot
} from 'lucide-react';
import { Story, Chapter } from '@/lib/types';
import RichTextEditor from '@/components/editor/RichTextEditor';
import CharacterManager from '@/components/characters/CharacterManager';
import AIAssistant from '@/components/ai-assistant/AIAssistant';
import WritingStatistics from '@/components/statistics/WritingStatistics';

export default function StoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const storyId = parseInt(params.id);
  
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'characters' | 'plot' | 'ai' | 'statistics'>('editor');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    loadStory();
    loadChapters();
  }, [storyId]);

  const loadStory = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data);
      } else if (response.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading story:', error);
    }
  };

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chapters?story_id=${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
        if (data.length > 0 && !activeChapter) {
          setActiveChapter(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChapter = async () => {
    if (!activeChapter) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/chapters/${activeChapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeChapter.title,
          content: activeChapter.content
        })
      });

      if (response.ok) {
        await loadChapters();
        await loadStory(); // Refresh story to update word count
      }
    } catch (error) {
      console.error('Error saving chapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const createChapter = async () => {
    if (!newChapterTitle.trim()) return;

    try {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_id: storyId,
          title: newChapterTitle,
          content: '',
          order_index: chapters.length
        })
      });

      if (response.ok) {
        await loadChapters();
        setShowNewChapter(false);
        setNewChapterTitle('');
        
        // Set the new chapter as active
        const newChapters = await fetch(`/api/chapters?story_id=${storyId}`).then(r => r.json());
        const newChapter = newChapters[newChapters.length - 1];
        setActiveChapter(newChapter);
      }
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
  };

  const handleContentChange = (content: string) => {
    if (activeChapter) {
      setActiveChapter({
        ...activeChapter,
        content
      });
    }
  };

  const handleAIInsert = (text: string) => {
    if (activeChapter) {
      const newContent = activeChapter.content + '\n\n' + text;
      setActiveChapter({
        ...activeChapter,
        content: newContent
      });
    }
  };

  const tabs = [
    { id: 'editor', label: 'เขียนเรื่อง', icon: Edit },
    { id: 'characters', label: 'ตัวละคร', icon: Users },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'statistics', label: 'สถิติ', icon: BarChart3 }
  ];

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--background]">
      {/* Header */}
      <header className="bg-[--background-elevated] border-b border-[--border] sticky top-0 z-40 backdrop-blur-md">
        <div className="container-max container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="btn-ghost btn-icon"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="p-2 bg-[--primary-light] rounded-[--radius] border border-[--primary]/20">
                <BookOpen className="w-5 h-5 text-[--primary]" />
              </div>
              <div>
                <h1 className="text-h3 text-[--foreground] font-semibold">{story.title}</h1>
                <div className="flex items-center space-x-3 text-caption text-[--foreground-tertiary]">
                  <span>{story.current_word_count.toLocaleString()} คำ</span>
                  {story.target_word_count > 0 && (
                    <>
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span>เป้าหมาย {story.target_word_count.toLocaleString()}</span>
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span>{Math.min((story.current_word_count / story.target_word_count) * 100, 100).toFixed(1)}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isSaving && (
                <div className="flex items-center space-x-2 text-[--foreground-secondary]">
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-body-sm">กำลังบันทึก...</span>
                </div>
              )}
              <button
                onClick={saveChapter}
                className="btn-primary"
                disabled={!activeChapter || isSaving}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-max flex">
        {/* Sidebar */}
        <div className="w-72 bg-[--background-elevated] border-r border-[--border] min-h-screen">
          {/* Navigation Tabs */}
          <div className="p-6 border-b border-[--border]">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={activeTab === tab.id ? 'nav-item-active w-full' : 'nav-item-inactive w-full'}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Chapter List (only show in editor tab) */}
          {activeTab === 'editor' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-body-sm text-[--foreground] font-semibold uppercase tracking-wide">ตอนทั้งหมด</h3>
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="btn-ghost btn-icon btn-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {showNewChapter && (
                <div className="mb-6 p-4 bg-[--background-secondary] rounded-[--radius] border border-[--border] scale-in">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="ชื่อตอนใหม่"
                    className="input mb-3"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={createChapter}
                      className="btn-primary btn-sm"
                      disabled={!newChapterTitle.trim()}
                    >
                      เพิ่มตอน
                    </button>
                    <button
                      onClick={() => {
                        setShowNewChapter(false);
                        setNewChapterTitle('');
                      }}
                      className="btn-secondary btn-sm"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter)}
                    className={`w-full text-left p-3 rounded-[--radius-sm] transition-all slide-in ${
                      activeChapter?.id === chapter.id
                        ? 'bg-[--primary-light] border border-[--primary]/20 text-[--primary]'
                        : 'hover:bg-[--background-secondary] border border-transparent text-[--foreground-secondary]'
                    }`}
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-body-sm font-medium truncate">
                          {chapter.title}
                        </span>
                      </div>
                      <span className="text-caption text-[--foreground-muted] ml-2 flex-shrink-0">
                        {chapter.word_count.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}

                {chapters.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[--background-secondary] rounded-[--radius-lg] flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-[--foreground-muted]" />
                    </div>
                    <p className="text-body-sm text-[--foreground-tertiary]">ยังไม่มีตอน</p>
                    <p className="text-caption text-[--foreground-muted] mt-1">สร้างตอนแรกเพื่อเริ่มเขียน</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[--background-elevated]">
          {activeTab === 'editor' && (
            <div className="h-screen overflow-hidden">
              {activeChapter ? (
                <div className="h-full flex flex-col">
                  <div className="p-8 border-b border-[--border] bg-[--background-elevated]">
                    <input
                      type="text"
                      value={activeChapter.title}
                      onChange={(e) => setActiveChapter({ ...activeChapter, title: e.target.value })}
                      className="text-h1 text-[--foreground] w-full border-none outline-none bg-transparent placeholder:text-[--foreground-muted] focus:outline-none"
                      placeholder="ชื่อตอน"
                    />
                    <div className="flex items-center space-x-4 mt-3 text-caption text-[--foreground-tertiary]">
                      <span>{activeChapter.word_count.toLocaleString()} คำ</span>
                      <span className="w-1 h-1 bg-current rounded-full"></span>
                      <span>อัปเดตล่าสุด: วันนี้</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-8">
                      <RichTextEditor
                        value={activeChapter.content}
                        onChange={handleContentChange}
                        onSave={saveChapter}
                        autoSave={true}
                        className="h-full"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-sm mx-auto">
                    <div className="w-24 h-24 bg-[--background-secondary] rounded-[--radius-xl] flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-[--foreground-muted]" />
                    </div>
                    <h3 className="text-h3 text-[--foreground] mb-3">เลือกตอนเพื่อเริ่มเขียน</h3>
                    <p className="text-body text-[--foreground-secondary] mb-6">สร้างตอนใหม่หรือเลือกตอนที่มีอยู่จากแถบด้านซ้าย</p>
                    <button
                      onClick={() => setShowNewChapter(true)}
                      className="btn-primary"
                    >
                      สร้างตอนใหม่
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="p-8 min-h-screen">
              <div className="max-w-4xl">
                <div className="mb-8">
                  <h2 className="text-h2 text-[--foreground] mb-2">จัดการตัวละคร</h2>
                  <p className="text-body text-[--foreground-secondary]">สร้างและจัดการตัวละครในเรื่องของคุณ</p>
                </div>
                <CharacterManager storyId={storyId} />
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-screen">
              <div className="h-full flex flex-col">
                <div className="p-8 border-b border-[--border]">
                  <h2 className="text-h2 text-[--foreground] mb-2">ผู้ช่วยเขียน AI</h2>
                  <p className="text-body text-[--foreground-secondary]">ใช้ AI เพื่อช่วยพัฒนาเรื่องราวและตัวละคร</p>
                </div>
                <div className="flex-1">
                  <AIAssistant 
                    storyContext={activeChapter?.content || ''} 
                    onInsertText={handleAIInsert}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="p-8 min-h-screen">
              <div className="max-w-4xl">
                <div className="mb-8">
                  <h2 className="text-h2 text-[--foreground] mb-2">สถิติการเขียน</h2>
                  <p className="text-body text-[--foreground-secondary]">ติดตามความก้าวหน้าและสถิติการเขียนของคุณ</p>
                </div>
                <WritingStatistics 
                  storyId={storyId}
                  targetWordCount={story.target_word_count}
                  currentWordCount={story.current_word_count}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}