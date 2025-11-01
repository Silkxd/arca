import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  style?: React.CSSProperties;
  className?: string;
}

/**
 * RichTextEditor - A wrapper component for ReactQuill
 * 
 * Note: This component wraps ReactQuill which internally uses the deprecated
 * findDOMNode API. This is a known limitation of the react-quill library
 * and cannot be resolved without updating the library itself.
 * 
 * The warning "findDOMNode is deprecated" comes from react-quill's internal
 * implementation and does not affect functionality.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite o conteúdo...",
  modules,
  formats,
  style,
  className = ""
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isReady, setIsReady] = useState(false);

  // Default modules configuration
  const defaultModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  // Default formats
  const defaultFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'color', 'background', 'align'
  ];

  useEffect(() => {
    // Suppress findDOMNode warnings specifically for ReactQuill
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const suppressReactQuillWarnings = (message: any, ...args: any[]) => {
      if (
        typeof message === 'string' && 
        (message.includes('findDOMNode is deprecated') || 
         message.includes('ReactQuill'))
      ) {
        // Suppress ReactQuill findDOMNode warnings
        return;
      }
      originalError(message, ...args);
    };

    const suppressReactQuillWarns = (message: any, ...args: any[]) => {
      if (
        typeof message === 'string' && 
        (message.includes('findDOMNode is deprecated') || 
         message.includes('ReactQuill'))
      ) {
        // Suppress ReactQuill findDOMNode warnings
        return;
      }
      originalWarn(message, ...args);
    };

    console.error = suppressReactQuillWarnings;
    console.warn = suppressReactQuillWarns;

    setIsReady(true);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const handleChange = (content: string) => {
    onChange(content);
  };

  if (!isReady) {
    return (
      <div className={`min-h-[300px] bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">Carregando editor...</div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules || defaultModules}
        formats={formats || defaultFormats}
        placeholder={placeholder}
        style={style}
      />
    </div>
  );
};