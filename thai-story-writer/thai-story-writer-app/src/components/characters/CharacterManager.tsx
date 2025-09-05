'use client';

import React, { useState, useEffect } from 'react';
import { Character, CreateCharacterData } from '@/lib/types';
import { User, Edit, Trash2, Plus, Users } from 'lucide-react';

interface CharacterManagerProps {
  storyId: number;
}

const CharacterManager: React.FC<CharacterManagerProps> = ({ storyId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    appearance: '',
    personality: '',
    background: '',
    role: 'supporting' as Character['role']
  });

  useEffect(() => {
    loadCharacters();
  }, [storyId]);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/characters?story_id=${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing && selectedCharacter) {
        // Update existing character
        const response = await fetch(`/api/characters/${selectedCharacter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          await loadCharacters();
          setSelectedCharacter(null);
          setIsEditing(false);
        }
      } else {
        // Create new character
        const characterData: CreateCharacterData = {
          story_id: storyId,
          ...formData
        };
        
        const response = await fetch('/api/characters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(characterData)
        });
        
        if (response.ok) {
          await loadCharacters();
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const handleDelete = async (characterId: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบตัวละครนี้?')) {
      try {
        const response = await fetch(`/api/characters/${characterId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await loadCharacters();
          setSelectedCharacter(null);
        }
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      appearance: '',
      personality: '',
      background: '',
      role: 'supporting'
    });
  };

  const startEdit = (character: Character) => {
    setSelectedCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      appearance: character.appearance,
      personality: character.personality,
      background: character.background,
      role: character.role
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setSelectedCharacter(null);
    setIsEditing(false);
    setShowAddForm(false);
    resetForm();
  };

  const roleColors = {
    main: 'bg-blue-100 text-blue-800',
    supporting: 'bg-green-100 text-green-800',
    antagonist: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const roleLabels = {
    main: 'ตัวหลัก',
    supporting: 'ตัวประกอบ',
    antagonist: 'ตัวร้าย',
    other: 'อื่นๆ'
  };

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
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          ตัวละคร ({characters.length})
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มตัวละคร
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'แก้ไขตัวละคร' : 'เพิ่มตัวละครใหม่'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ชื่อตัวละคร"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บทบาท
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Character['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="main">ตัวหลัก</option>
                <option value="supporting">ตัวประกอบ</option>
                <option value="antagonist">ตัวร้าย</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="อธิบายตัวละครโดยสังเขป"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปลักษณ์
              </label>
              <textarea
                value={formData.appearance}
                onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="อธิบายรูปลักษณ์ของตัวละคร"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บุคลิกภาพ
              </label>
              <textarea
                value={formData.personality}
                onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="อธิบายบุคลิกภาพของตัวละคร"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประวัติส่วนตัว
              </label>
              <textarea
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="อธิบายประวัติและที่มาของตัวละคร"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={!formData.name.trim()}
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มตัวละคร'}
            </button>
          </div>
        </div>
      )}

      {/* Characters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <User className="w-8 h-8 text-gray-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{character.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${roleColors[character.role]}`}>
                    {roleLabels[character.role]}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(character)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(character.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {character.description && (
              <p className="text-gray-600 mb-3 text-sm">{character.description}</p>
            )}

            {character.appearance && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-1">รูปลักษณ์:</h4>
                <p className="text-gray-600 text-sm">{character.appearance}</p>
              </div>
            )}

            {character.personality && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-1">บุคลิกภาพ:</h4>
                <p className="text-gray-600 text-sm">{character.personality}</p>
              </div>
            )}

            {character.background && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">ประวัติ:</h4>
                <p className="text-gray-600 text-sm">{character.background}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {characters.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีตัวละคร</h3>
          <p className="text-gray-600 mb-4">เริ่มสร้างตัวละครสำหรับเรื่องของคุณ</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มตัวละครแรก
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;