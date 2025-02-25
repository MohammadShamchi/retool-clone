import { useDrag } from 'react-dnd';
import { useState, useCallback } from 'react';
import { useDndRef } from '../hooks/useDndRef';

interface ImageComponentProps {
  id: string;
  url: string;
  onEdit?: (url: string) => void;
  isPreview?: boolean;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({ id, url, onEdit, isPreview = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(url);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'component',
    item: { id, type: 'image', fromCanvas: !isPreview },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, isPreview]);

  // Use our custom hook for proper ref handling
  const setRef = useDndRef(dragRef);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onEdit?.(tempUrl);
    setIsEditing(false);
  }, [onEdit, tempUrl]);

  const handleCancel = useCallback(() => {
    setTempUrl(url);
    setIsEditing(false);
  }, [url]);

  if (isPreview) {
    return (
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <img src={url} alt="Preview" className="w-full h-auto" />
      </div>
    );
  }

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
          className="absolute top-2 right-2 z-10 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm"
          onClick={() => setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
          title="Edit image URL"
          aria-label="Edit image URL"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="absolute inset-0 bg-white p-4 z-20" onMouseDown={(e) => e.stopPropagation()}>
          <label htmlFor={`image-url-${id}`} className="block mb-2 text-sm font-medium text-gray-700">Image URL</label>
          <input
            id={`image-url-${id}`}
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter image URL (e.g., https://placehold.co/600x400)"
            autoFocus
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              Use a direct image URL (ends with .jpg, .png, etc.)
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 text-sm bg-gray-200 rounded"
                onMouseDown={(e) => e.stopPropagation()}
                title="Cancel changes"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                onMouseDown={(e) => e.stopPropagation()}
                title="Save changes"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div 
          className="relative w-full h-full min-h-[100px] cursor-pointer group"
          onClick={() => setIsEditing(true)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={url}
              alt="Content"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            <span className="text-transparent group-hover:text-white">Click to edit URL</span>
          </div>
        </div>
      )}
    </div>
  );
};
