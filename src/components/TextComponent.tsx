import { useDrag } from 'react-dnd';
import ReactMarkdown from 'react-markdown';
import { useState, useCallback } from 'react';
import { useDndRef } from '../hooks/useDndRef';

interface TextComponentProps {
  id: string;
  content: string;
  onEdit?: (content: string) => void;
  isPreview?: boolean;
}

export const TextComponent: React.FC<TextComponentProps> = ({ id, content, onEdit, isPreview = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'component',
    item: { id, type: 'text', fromCanvas: !isPreview },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, isPreview]);

  // Use our custom hook to fix TypeScript issues with react-dnd refs
  const setRef = useDndRef(dragRef);

  if (isPreview) {
    return (
      <div className="h-full p-4">
        <div className="prose max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    onEdit?.(text);
  }, [text, onEdit]);

  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setText(content);
  }, [content]);

  const insertMarkdown = useCallback((markdownTemplate: string) => {
    const textarea = document.querySelector(`#editor-${id}`) as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    
    let newText;
    if (selectedText) {
      // Replace the template placeholder with the selected text
      newText = beforeText + markdownTemplate.replace('$1', selectedText) + afterText;
    } else {
      // No text selected, just insert the template
      newText = beforeText + markdownTemplate.replace('$1', 'text') + afterText;
    }
    
    setText(newText);
    
    // Focus back on textarea and position cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length - (beforeText.length + afterText.length);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [id, text]);

  return (
    <div className="h-full relative group" onMouseDown={(e) => e.stopPropagation()}>
      {/* Move handle */}
      <div
        ref={setRef}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="absolute top-2 left-2 cursor-move bg-gray-100 hover:bg-gray-200 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-600 z-10"
        onMouseDown={(e) => e.stopPropagation()}
        title="Drag to move"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
        </svg>
      </div>

      {/* Edit button */}
      {!isEditing && (
        <button
          className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm z-10"
          onClick={handleEdit}
          onMouseDown={(e) => e.stopPropagation()}
          title="Edit text"
          aria-label="Edit text"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      )}

      <div className="p-4">
        {isEditing ? (
          <div 
            className="absolute inset-0 bg-white p-4 z-20" 
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Markdown toolbar */}
            <div className="flex flex-wrap gap-1 mb-2 p-1 bg-gray-50 rounded border">
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('# $1')}
                title="Heading 1"
                aria-label="Insert Heading 1"
              >
                H1
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('## $1')}
                title="Heading 2"
                aria-label="Insert Heading 2"
              >
                H2
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('### $1')}
                title="Heading 3"
                aria-label="Insert Heading 3"
              >
                H3
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('**$1**')}
                title="Bold"
                aria-label="Make text bold"
              >
                <strong>B</strong>
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('*$1*')}
                title="Italic"
                aria-label="Make text italic"
              >
                <em>I</em>
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('[$1](https://example.com)')}
                title="Link"
                aria-label="Insert link"
              >
                🔗
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('- $1')}
                title="List Item"
                aria-label="Insert bullet list item"
              >
                • List
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('1. $1')}
                title="Numbered List"
                aria-label="Insert numbered list item"
              >
                1. List
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('> $1')}
                title="Blockquote"
                aria-label="Insert blockquote"
              >
                "Quote"
              </button>
              <button 
                className="p-1 hover:bg-gray-200 rounded text-sm" 
                onClick={() => insertMarkdown('`$1`')}
                title="Inline Code"
                aria-label="Insert code"
              >
                Code
              </button>
            </div>

            <textarea
              id={`editor-${id}`}
              className="w-full h-full min-h-[100px] p-2 border rounded resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Enter markdown text here"
              aria-label="Markdown text editor"
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                className="px-3 py-1 text-sm bg-gray-200 rounded"
                onClick={handleCancel}
                onMouseDown={(e) => e.stopPropagation()}
                title="Cancel editing"
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                onClick={handleSave}
                onMouseDown={(e) => e.stopPropagation()}
                title="Save changes"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="prose max-w-none cursor-pointer" 
            onClick={handleEdit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
