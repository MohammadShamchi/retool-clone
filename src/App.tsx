import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PreviewMode } from './components/PreviewMode';

interface CanvasItem {
  id: string;
  type: string;
  content: string;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

function App() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Retool Clone</h1>
          <div className="ml-4 text-xs text-gray-400">
            {isPreview ? 'Preview Mode' : 'Edit Mode'}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
            title="Open help"
          >
            Help
          </button>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            title={isPreview ? 'Switch to edit mode' : 'Preview your design'}
          >
            {isPreview ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>
      
      {isPreview ? (
        <PreviewMode items={items} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="flex-1 flex">
            <Toolbar />
            <div className="flex-1 relative">
              <Canvas items={items} setItems={setItems} />
            </div>
          </div>
        </DndProvider>
      )}
      
      {/* Help dialog */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Use Retool Clone</h2>
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close help dialog"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Step 1: Add Components</h3>
                <p className="text-gray-600">Drag Text or Image components from the left sidebar onto the canvas.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Step 2: Edit Content</h3>
                <p className="text-gray-600">
                  Click on any component to edit its content. Text components support Markdown formatting, 
                  and Image components accept image URLs.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Step 3: Arrange Layout</h3>
                <p className="text-gray-600">
                  Drag components by their headers to reposition them. Use the resize handles on the corners to change their size.
                  You can also use the + and - buttons to adjust component width.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Step 4: Preview</h3>
                <p className="text-gray-600">
                  Click the "Preview" button in the top-right corner to see how your design looks.
                  In preview mode, layouts will automatically adjust for mobile devices.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg">Tips</h3>
                <ul className="text-gray-600 list-disc pl-5 space-y-1">
                  <li>Components placed side-by-side will create columns</li>
                  <li>Use the 12-column grid for precise layouts</li>
                  <li>Each component shows its width out of 12 columns</li>
                  <li>Templates can help you get started quickly</li>
                </ul>
              </div>
            </div>
            
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
