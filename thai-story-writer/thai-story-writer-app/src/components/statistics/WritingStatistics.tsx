'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Clock, PenTool, Calendar } from 'lucide-react';
import { WritingStats, WritingSession } from '@/lib/types';

interface WritingStatisticsProps {
  storyId: number;
  targetWordCount?: number;
  currentWordCount?: number;
}

const WritingStatistics: React.FC<WritingStatisticsProps> = ({
  storyId,
  targetWordCount = 0,
  currentWordCount = 0
}) => {
  const [stats, setStats] = useState<WritingStats | null>(null);
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    loadStatistics();
  }, [storyId, timeFrame]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      
      // Load writing sessions
      const sessionsResponse = await fetch(`/api/statistics/sessions?story_id=${storyId}&days=${timeFrame}`);
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
      }

      // Load overall stats
      const statsResponse = await fetch(`/api/statistics/overview?story_id=${storyId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    const data = sessions.map(session => ({
      date: new Date(session.date).toLocaleDateString('th-TH', { 
        month: 'short', 
        day: 'numeric' 
      }),
      words: session.words_written,
      duration: Math.round(session.session_duration / 60) // Convert to minutes
    })).reverse();

    return data;
  };

  // Calculate progress percentage
  const progressPercentage = targetWordCount > 0 ? Math.min((currentWordCount / targetWordCount) * 100, 100) : 0;

  // Calculate daily average
  const dailyAverage = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + session.words_written, 0) / sessions.length)
    : 0;

  // Calculate writing streak
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const chartData = prepareChartData();
  const writingStreak = calculateStreak();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">สถิติการเขียน</h2>
        <div className="flex space-x-2">
          {['7', '30', '90'].map((days) => (
            <button
              key={days}
              onClick={() => setTimeFrame(days as '7' | '30' | '90')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeFrame === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {days} วัน
            </button>
          ))}
        </div>
      </div>

      {/* Progress Card */}
      {targetWordCount > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">ความก้าวหน้า</h3>
                <p className="text-blue-100">เป้าหมาย: {targetWordCount.toLocaleString()} คำ</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{progressPercentage.toFixed(1)}%</div>
              <div className="text-blue-100">{currentWordCount.toLocaleString()} คำ</div>
            </div>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <PenTool className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">จำนวนคำทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_words.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">เวลาเขียนทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((stats?.total_time || 0) / 60)} นาที
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">เฉลี่ยต่อวัน</p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyAverage.toLocaleString()} คำ
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">ต่อเนื่อง</p>
              <p className="text-2xl font-bold text-gray-900">
                {writingStreak} วัน
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Words per day chart */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">จำนวนคำต่อวัน</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} ${name === 'words' ? 'คำ' : 'นาที'}`,
                    name === 'words' ? 'จำนวนคำ' : 'เวลา'
                  ]}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="words" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Writing time chart */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">เวลาเขียนต่อวัน (นาที)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value} นาที`, 'เวลาเขียน']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* No data message */}
      {chartData.length === 0 && (
        <div className="bg-white p-12 rounded-lg border shadow-sm text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูลสถิติ</h3>
          <p className="text-gray-600">
            เริ่มเขียนและบันทึกงานเพื่อดูสถิติการเขียนของคุณ
          </p>
        </div>
      )}
    </div>
  );
};

export default WritingStatistics;