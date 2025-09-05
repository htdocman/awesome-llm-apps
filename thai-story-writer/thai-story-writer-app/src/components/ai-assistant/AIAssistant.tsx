'use client';

import React, { useState } from 'react';
import { Bot, Send, Lightbulb, Users, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { AIPrompt } from '@/lib/types';

interface AIAssistantProps {
  storyContext?: string;
  onInsertText?: (text: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  storyContext = '',
  onInsertText 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<AIPrompt['type']>('continue');
  const [userRequest, setUserRequest] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  const promptTypes = [
    {
      type: 'continue' as const,
      label: 'ต่อเรื่อง',
      icon: ArrowRight,
      description: 'ช่วยต่อเนื้อเรื่องจากจุดที่หยุด',
      placeholder: 'ต่อเรื่องจากจุดนี้ให้สนุกและน่าติดตาม'
    },
    {
      type: 'character' as const,
      label: 'พัฒนาตัวละคร',
      icon: Users,
      description: 'ช่วยสร้างและพัฒนาตัวละคร',
      placeholder: 'ช่วยพัฒนาตัวละครหลักให้มีมิติมากขึ้น'
    },
    {
      type: 'plot' as const,
      label: 'โครงเรื่อง',
      icon: Lightbulb,
      description: 'ช่วยคิดเหตุการณ์และพล็อต',
      placeholder: 'ช่วยคิดเหตุการณ์ที่น่าสนใจสำหรับตอนต่อไป'
    },
    {
      type: 'dialogue' as const,
      label: 'บทสนทนา',
      icon: MessageSquare,
      description: 'ช่วยเขียนบทสนทนา',
      placeholder: 'ช่วยเขียนบทสนทนาระหว่างตัวละครให้เป็นธรรมชาติ'
    },
    {
      type: 'description' as const,
      label: 'บรรยาย',
      icon: FileText,
      description: 'ช่วยเขียนการบรรยาย',
      placeholder: 'ช่วยบรรยายฉากหรือบรรยากาศให้มีภาพพจน์'
    }
  ];

  const handleSendRequest = async () => {
    if (!userRequest.trim() || isLoading) return;

    const userMessage = {
      type: 'user' as const,
      content: userRequest,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          context: storyContext,
          request: userRequest
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        type: 'ai' as const,
        content: data.content,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
      setUserRequest('');
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage = {
        type: 'ai' as const,
        content: 'เกิดข้อผิดพลาดในการเรียกใช้ AI Assistant กรุณาลองใหม่อีกครั้ง',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendRequest();
    }
  };

  const insertText = (text: string) => {
    if (onInsertText) {
      onInsertText(text);
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          </div>
          {conversation.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ล้างการสนทนา
            </button>
          )}
        </div>
      </div>

      {/* Prompt Type Selection */}
      <div className="p-4 border-b bg-gray-50">
        <p className="text-sm text-gray-600 mb-3">เลือกประเภทความช่วยเหลือ:</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {promptTypes.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                key={prompt.type}
                onClick={() => setSelectedType(prompt.type)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  selectedType === prompt.type
                    ? 'bg-blue-100 border-blue-300 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                } border`}
              >
                <div className="flex items-center mb-1">
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">{prompt.label}</span>
                </div>
                <p className="text-xs text-gray-500">{prompt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">พร้อมช่วยเหลือแล้ว!</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              เลือกประเภทความช่วยเหลือที่ต้องการ แล้วพิมพ์คำขอของคุณ 
              AI จะช่วยให้คำแนะนำและไอเดียสำหรับการเขียนนิยาย
            </p>
          </div>
        ) : (
          conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.type === 'ai' && onInsertText && (
                  <button
                    onClick={() => insertText(message.content)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors bg-white px-2 py-1 rounded"
                  >
                    แทรกในเรื่อง
                  </button>
                )}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('th-TH')}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm">AI กำลังคิด...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-3">
          <textarea
            value={userRequest}
            onChange={(e) => setUserRequest(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={promptTypes.find(p => p.type === selectedType)?.placeholder || ''}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleSendRequest}
            disabled={!userRequest.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          กด Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;