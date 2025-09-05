'use client';

import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, BarChart3, FileText, Users } from 'lucide-react';
import { Story } from '@/lib/types';

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    genre: '',
    target_word_count: 10000
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createStory = async () => {
    if (!newStory.title.trim()) return;

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStory)
      });
      
      if (response.ok) {
        await loadStories();
        setShowCreateModal(false);
        setNewStory({ title: '', description: '', genre: '', target_word_count: 10000 });
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'in-progress': return 'กำลังเขียน';
      case 'published': return 'เผยแพร่แล้ว';
      default: return 'ฉบับร่าง';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[--background]">
      {/* Header */}
      <header className="bg-[--background-elevated] border-b border-[--border] sticky top-0 z-50 backdrop-blur-md">
        <div className="container-max container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[--primary-light] rounded-[--radius] border border-[--primary]/20">
                <BookOpen className="w-5 h-5 text-[--primary]" />
              </div>
              <div>
                <h1 className="text-h3 text-[--foreground] font-semibold">Thai Story Writer</h1>
                <p className="text-caption text-[--foreground-tertiary]">เขียนนิยายด้วย AI</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2 scale-in"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างเรื่องใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-max container-padding section-spacing">
        {/* Welcome Section */}
        <div className="card-elevated surface-floating p-8 mb-8 bg-gradient-to-br from-[--primary] to-blue-600 text-white scale-in">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-display text-white mb-3 font-bold">ยินดีต้อนรับสู่<br/>Thai Story Writer</h2>
              <p className="text-body text-blue-50 mb-6 max-w-2xl">
                แพลตฟอร์มเขียนนิยายภาษาไทยที่สมบูรณ์แบบ พร้อมเครื่องมือช่วยเขียนด้วย AI ที่ทันสมัย
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-[--radius] backdrop-blur-sm">
                  <FileText className="w-4 h-4" />
                  <span>Rich Text Editor</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-[--radius] backdrop-blur-sm">
                  <Users className="w-4 h-4" />
                  <span>จัดการตัวละคร</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-[--radius] backdrop-blur-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span>สถิติการเขียน</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-[--radius-xl] backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="card p-6 card-hover slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[--primary-light] rounded-[--radius-lg]">
                <BookOpen className="w-6 h-6 text-[--primary]" />
              </div>
              <div className="flex-1">
                <p className="text-body-sm text-[--foreground-tertiary] font-medium">เรื่องทั้งหมด</p>
                <p className="text-h2 text-[--foreground] font-bold mt-1">{stories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6 card-hover slide-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[--success-light] rounded-[--radius-lg]">
                <FileText className="w-6 h-6 text-[--success]" />
              </div>
              <div className="flex-1">
                <p className="text-body-sm text-[--foreground-tertiary] font-medium">กำลังเขียน</p>
                <p className="text-h2 text-[--foreground] font-bold mt-1">
                  {stories.filter(s => s.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 card-hover slide-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-[--radius-lg]">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-body-sm text-[--foreground-tertiary] font-medium">เสร็จสิ้น</p>
                <p className="text-h2 text-[--foreground] font-bold mt-1">
                  {stories.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div className="card slide-in" style={{animationDelay: '0.4s'}}>
          <div className="px-6 py-5 border-b border-[--border]">
            <div className="flex items-center justify-between">
              <h3 className="text-h3 text-[--foreground]">เรื่องของคุณ</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-ghost btn-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="spinner w-8 h-8"></div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-[--background-secondary] rounded-[--radius-xl] flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-[--foreground-muted]" />
              </div>
              <h3 className="text-h3 text-[--foreground] mb-2">ยังไม่มีเรื่องราว</h3>
              <p className="text-body text-[--foreground-secondary] mb-8 max-w-sm mx-auto">
                เริ่มต้นสร้างสรรค์เรื่องราวแรกของคุณ พร้อมเครื่องมือช่วยเขียนที่ทันสมัย
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>สร้างเรื่องแรก</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[--border]">
              {stories.map((story, index) => (
                <div key={story.id} className="p-6 card-interactive slide-in" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`status-${story.status === 'in-progress' ? 'progress' : story.status === 'completed' ? 'completed' : story.status === 'published' ? 'published' : 'draft'} mt-2`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-h3 text-[--foreground] font-semibold truncate">
                              {story.title}
                            </h4>
                            <span className={`badge ${
                              story.status === 'completed' ? 'badge-success' :
                              story.status === 'in-progress' ? 'badge-primary' :
                              story.status === 'published' ? 'text-purple-600 bg-purple-50' :
                              'badge-secondary'
                            }`}>
                              {getStatusLabel(story.status)}
                            </span>
                          </div>
                          
                          {story.description && (
                            <p className="text-body-sm text-[--foreground-secondary] mb-4 line-clamp-2">{story.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-caption text-[--foreground-tertiary]">
                            {story.genre && (
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                <span>{story.genre}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-current rounded-full"></span>
                              <span>{story.current_word_count.toLocaleString()} คำ</span>
                            </div>
                            {story.target_word_count > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                <span>เป้าหมาย {story.target_word_count.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-current rounded-full"></span>
                              <span>{formatDate(story.updated_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      {story.target_word_count > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-caption text-[--foreground-tertiary] font-medium">ความก้าวหน้า</span>
                            <span className="text-caption text-[--foreground-secondary] font-semibold">
                              {Math.min((story.current_word_count / story.target_word_count) * 100, 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className={`progress-fill ${
                                (story.current_word_count / story.target_word_count) >= 1 ? 'progress-fill-success' :
                                (story.current_word_count / story.target_word_count) >= 0.7 ? 'progress-fill-warning' :
                                'progress-fill'
                              }`}
                              style={{
                                width: `${Math.min((story.current_word_count / story.target_word_count) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex-shrink-0">
                      <a
                        href={`/story/${story.id}`}
                        className="btn-primary"
                      >
                        เปิดเรื่อง
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="surface-floating p-6 w-full max-w-lg scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3 text-[--foreground]">สร้างเรื่องใหม่</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewStory({ title: '', description: '', genre: '', target_word_count: 10000 });
                }}
                className="btn-ghost btn-icon"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>
            
            <div className="content-spacing">
              <div className="form-group">
                <label className="form-label form-label-required">
                  ชื่อเรื่อง
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="input"
                  placeholder="ใส่ชื่อเรื่องของคุณ"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  คำอธิบาย
                </label>
                <textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="อธิบายเรื่องของคุณโดยสังเขป"
                />
                <p className="form-hint">สามารถเว้นว่างไว้แล้วมาเพิ่มทีหลังได้</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    หมวดหมู่
                  </label>
                  <select
                    value={newStory.genre}
                    onChange={(e) => setNewStory({ ...newStory, genre: e.target.value })}
                    className="form-select"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="romance">โรแมนติก</option>
                    <option value="fantasy">แฟนตาซี</option>
                    <option value="mystery">ลึกลับ</option>
                    <option value="adventure">ผจญภัย</option>
                    <option value="drama">ดรามา</option>
                    <option value="horror">สยองขวัญ</option>
                    <option value="comedy">ตลก</option>
                    <option value="sci-fi">วิทยาศาสตร์</option>
                    <option value="historical">อิสตอริก</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    เป้าหมายจำนวนคำ
                  </label>
                  <input
                    type="number"
                    value={newStory.target_word_count}
                    onChange={(e) => setNewStory({ ...newStory, target_word_count: parseInt(e.target.value) || 0 })}
                    className="input"
                    min="0"
                    step="1000"
                    placeholder="10,000"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-[--border]">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewStory({ title: '', description: '', genre: '', target_word_count: 10000 });
                }}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                onClick={createStory}
                disabled={!newStory.title.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                สร้างเรื่อง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}