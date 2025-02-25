import React from 'react';
import { useDrag } from 'react-dnd';
import { TextComponent } from './TextComponent';
import { ImageComponent } from './ImageComponent';
import { Templates } from './Templates';
import { useDndRef } from '../hooks/useDndRef';

// The toolbar contains draggable components that users can add to the canvas
export const Toolbar = () => {
  // Text component drag setup
  const [{ isDragging: isTextDragging }, textDragRef] = useDrag(() => ({
    type: 'component',
    item: { type: 'text', fromCanvas: false },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Image component drag setup
  const [{ isDragging: isImageDragging }, imageDragRef] = useDrag(() => ({
    type: 'component',
    item: { type: 'image', fromCanvas: false },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Fix for TypeScript compatibility issues with refs
  const setTextRef = useDndRef(textDragRef);
  const setImageRef = useDndRef(imageDragRef);

  // TODO: Add more component types in the future

  return (
    <div className="w-60 bg-white border-r border-gray-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="font-semibold text-lg">Components</h2>
      
      <div className="space-y-4">
        {/* Text component card */}
        <div
          ref={setTextRef}
          className={`p-4 border rounded-lg bg-gray-50 cursor-move hover:bg-gray-100 ${
            isTextDragging ? 'opacity-50' : ''
          }`}
        >
          <h3 className="font-medium">Text Component</h3>
          <p className="text-sm text-gray-500">Drag to add text</p>
        </div>

        {/* Image component card */}
        <div
          ref={setImageRef}
          className={`p-4 border rounded-lg bg-gray-50 cursor-move hover:bg-gray-100 ${
            isImageDragging ? 'opacity-50' : ''
          }`}
        >
          <h3 className="font-medium">Image Component</h3>
          <p className="text-sm text-gray-500">Drag to add image</p>
        </div>
      </div>
      
      {/* Template section */}
      <div className="mt-6">
        <Templates />
      </div>
    </div>
  );
};
