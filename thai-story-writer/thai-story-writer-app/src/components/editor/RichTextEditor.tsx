'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoSave?: boolean;
  onSave?: () => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "เริ่มเขียนเรื่องของคุณที่นี่...",
  autoSave = true,
  onSave,
  className = ""
}) => {
  const quillRef = useRef<any>(null);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const autoSaveTimer = setTimeout(() => {
      if (value && value !== '') {
        setIsSaving(true);
        onSave();
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [value, autoSave, onSave]);

  // Update word and character count
  useEffect(() => {
    const plainText = value.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(plainText.length);
  }, [value]);

  // Quill modules with Thai language support
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': ['sans-serif', 'serif', 'monospace', 'sarabun', 'kanit'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link'
  ];

  // Manual save function
  const handleSave = useCallback(() => {
    if (onSave) {
      setIsSaving(true);
      onSave();
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 1000);
    }
  }, [onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className={`w-full ${className}`}>
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-[--background-secondary] rounded-[--radius] border border-[--border]">
        <div className="flex items-center space-x-6 text-caption text-[--foreground-tertiary]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[--primary] rounded-full"></div>
            <span>คำ: {wordCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[--success] rounded-full"></div>
            <span>ตัวอักษร: {charCount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isSaving && (
            <div className="flex items-center space-x-2 text-[--foreground-secondary]">
              <div className="spinner w-4 h-4"></div>
              <span className="text-caption">กำลังบันทึก...</span>
            </div>
          )}
          {!isSaving && autoSave && (
            <span className="text-caption text-[--foreground-muted]">
              บันทึกล่าสุด: {lastSaved.toLocaleTimeString('th-TH')}
            </span>
          )}
          <button
            onClick={handleSave}
            className="btn-primary btn-sm"
            title="บันทึก (Ctrl+S)"
          >
            บันทึก
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-[600px] rounded-[--radius] overflow-hidden border border-[--border] bg-[--background-elevated] shadow-[--shadow]">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          style={{
            minHeight: '600px',
            fontFamily: 'Sarabun, Inter, sans-serif'
          }}
        />
      </div>

      <style jsx global>{`
        /* Enhanced Quill Editor Styles */
        .ql-editor {
          font-family: 'Sarabun', 'Inter', 'Noto Sans Thai', sans-serif !important;
          font-size: 18px;
          line-height: 1.8;
          padding: 32px !important;
          color: var(--foreground);
          background: var(--background-elevated);
          border: none !important;
        }
        
        .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
          font-family: 'Kanit', 'Inter', sans-serif !important;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          color: var(--foreground);
        }
        
        .ql-editor h1 { font-size: 2em; font-weight: 600; }
        .ql-editor h2 { font-size: 1.75em; font-weight: 600; }
        .ql-editor h3 { font-size: 1.5em; font-weight: 600; }
        
        .ql-editor p {
          margin-bottom: 1.25em;
          color: var(--foreground);
        }
        
        .ql-font-sarabun {
          font-family: 'Sarabun', sans-serif !important;
        }
        
        .ql-font-kanit {
          font-family: 'Kanit', sans-serif !important;
        }
        
        .ql-font-inter {
          font-family: 'Inter', sans-serif !important;
        }
        
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          background: var(--background-secondary) !important;
          padding: 16px 24px !important;
        }
        
        .ql-toolbar .ql-formats {
          margin-right: 16px;
        }
        
        .ql-toolbar button {
          border-radius: var(--radius-sm) !important;
          width: 32px !important;
          height: 32px !important;
          margin: 0 2px !important;
          color: var(--foreground-secondary) !important;
          transition: all 0.15s ease !important;
        }
        
        .ql-toolbar button:hover {
          background-color: var(--background-tertiary) !important;
          color: var(--foreground) !important;
        }
        
        .ql-toolbar button.ql-active {
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }
        
        .ql-toolbar .ql-picker {
          color: var(--foreground-secondary) !important;
        }
        
        .ql-toolbar .ql-picker:hover {
          color: var(--foreground) !important;
        }
        
        .ql-toolbar .ql-picker-label {
          border-radius: var(--radius-sm) !important;
          padding: 4px 8px !important;
        }
        
        .ql-toolbar .ql-picker-label:hover {
          background-color: var(--background-tertiary) !important;
        }
        
        .ql-container {
          border: none !important;
          font-family: 'Sarabun', 'Inter', sans-serif;
        }
        
        .ql-editor.ql-blank::before {
          font-family: 'Sarabun', 'Inter', sans-serif !important;
          font-style: normal !important;
          color: var(--foreground-muted) !important;
          font-size: 18px !important;
          padding: 32px !important;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid var(--primary) !important;
          background: var(--background-secondary) !important;
          padding: 16px 20px !important;
          margin: 16px 0 !important;
          border-radius: var(--radius-sm) !important;
          color: var(--foreground-secondary) !important;
          font-style: italic;
        }
        
        .ql-editor code {
          background: var(--background-tertiary) !important;
          color: var(--foreground) !important;
          padding: 2px 6px !important;
          border-radius: var(--radius-sm) !important;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace !important;
          font-size: 0.9em !important;
        }
        
        .ql-editor pre {
          background: var(--background-tertiary) !important;
          color: var(--foreground) !important;
          padding: 20px !important;
          border-radius: var(--radius) !important;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace !important;
          border: 1px solid var(--border) !important;
        }
        
        /* Focus states */
        .ql-editor:focus {
          outline: none !important;
        }
        
        .ql-container:focus-within {
          box-shadow: 0 0 0 2px var(--primary) !important;
          border-radius: var(--radius) !important;
        }
        
        /* Selection styles */
        .ql-editor ::selection {
          background-color: var(--primary-light) !important;
          color: var(--primary) !important;
        }
        
        /* Link styles */
        .ql-editor a {
          color: var(--primary) !important;
          text-decoration: none !important;
          border-bottom: 1px solid var(--primary) !important;
          transition: all 0.15s ease !important;
        }
        
        .ql-editor a:hover {
          background-color: var(--primary-light) !important;
          border-radius: 2px !important;
          padding: 2px 4px !important;
          margin: 0 -4px !important;
        }
        
        /* List styles */
        .ql-editor ul, .ql-editor ol {
          padding-left: 1.5em !important;
          margin-bottom: 1em !important;
        }
        
        .ql-editor li {
          margin-bottom: 0.5em !important;
          line-height: 1.8 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;