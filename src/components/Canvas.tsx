import React, { useCallback, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import GridLayout from 'react-grid-layout';
import { ImageComponent } from './ImageComponent';
import { TextComponent } from './TextComponent';
import { Template } from './Templates';
import { useDndRef } from '../hooks/useDndRef';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Define module declarations to fix import errors
declare module 'react-grid-layout';
declare module 'react-grid-layout/css/styles.css';
declare module 'react-resizable/css/styles.css';

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

interface CanvasProps {
  items: CanvasItem[];
  setItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
}

export const Canvas: React.FC<CanvasProps> = ({ items = [], setItems }) => {
  const [width, setWidth] = useState(window.innerWidth - 240); // Subtract sidebar width
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - 240);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide welcome message when items are added
  useEffect(() => {
    if (items.length > 0) {
      setShowWelcomeMessage(false);
    }
  }, [items.length]);

  const rowHeight = 50;
  const cols = 12;
  const margin = [10, 10];
  const containerPadding = [10, 10];

  const handleDrop = useCallback((item: any, monitor: any) => {
    const offset = monitor.getClientOffset();
    if (!offset) return;

    // Handle template drops
    if (item.type === 'template') {
      // Calculate starting Y position - find the maximum y + height of existing items
      const maxY = items.length > 0 
        ? Math.max(...items.map(i => i.layout.y + i.layout.h))
        : 0;
      
      // Create items from template sections
      const templateItems = item.sections.map((section: any) => ({
        id: `${section.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: section.type,
        content: section.content,
        layout: {
          ...section.layout,
          i: `${section.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          // Adjust y position to place below existing content
          y: section.layout.y + maxY
        }
      }));
      
      setItems(prev => [...prev, ...templateItems]);
      return;
    }

    // Handle component drops (existing logic)
    const dropX = Math.round((offset.x - 240) / (width / cols));
    const dropY = Math.round(offset.y / rowHeight);

    // Find items in the same row
    const itemsInRow = items.filter(i => i.layout.y === dropY);
    const totalWidthInRow = itemsInRow.reduce((sum, i) => sum + i.layout.w, 0);
    const availableWidth = cols - totalWidthInRow;

    // Calculate width to fit in remaining space or default to half width
    const newItemWidth = Math.min(6, availableWidth > 0 ? availableWidth : 6);

    const newItem: CanvasItem = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      content: item.type === 'text' ? '# New Text\nEdit me!' : 'https://placehold.co/600x400',
      layout: {
        i: `${item.type}-${Date.now()}`,
        x: itemsInRow.length > 0 ? totalWidthInRow : dropX,
        y: dropY,
        w: newItemWidth,
        h: item.type === 'text' ? 4 : 6
      }
    };

    setItems(prev => [...prev, newItem]);
  }, [cols, items, setItems, width]);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ['component', 'template'],
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;
      handleDrop(item, monitor);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [handleDrop]);

  // Use custom hook for better TypeScript compatibility
  const setDropRef = useDndRef(dropRef);

  const onLayoutChange = useCallback((layout: any[]) => {
    setItems(prev => prev.map(item => ({
      ...item,
      layout: layout.find(l => l.i === item.layout.i) || item.layout
    })));
  }, [setItems]);

  return (
    <div
      ref={setDropRef}
      className="absolute inset-0 bg-gray-100 overflow-auto"
    >
      <div className={`min-h-full p-4 ${isOver ? 'bg-blue-50' : ''} relative`}>
        {/* Grid overlay for 12-column guidance */}
        <div className="absolute inset-0 grid grid-cols-12 gap-x-2 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="h-full border-x border-blue-100 bg-blue-50 bg-opacity-10"
              style={{ gridColumn: `${i + 1} / span 1` }}
            ></div>
          ))}
        </div>
        
        {/* Welcome message for empty canvas */}
        {showWelcomeMessage && items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto space-y-4 pointer-events-auto">
              <h2 className="text-xl font-bold text-gray-800">Welcome to Retool Clone</h2>
              <p className="text-gray-600">
                Get started by dragging components from the sidebar onto this canvas. 
                You can create beautiful layouts with text and images.
              </p>
              <div className="flex items-center space-x-4 justify-center">
                <div className="flex items-center">
                  <span className="mr-2">←</span>
                  <span className="text-sm text-gray-500">Drag components from sidebar</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Preview your design</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setShowWelcomeMessage(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}
        
        <GridLayout
          className="layout"
          layout={items.map(item => item.layout)}
          cols={cols}
          rowHeight={rowHeight}
          width={width}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          isResizable={true}
          isBounded={true}
          margin={margin}
          containerPadding={containerPadding}
          compactType={null}
          preventCollision={false}
          resizeHandles={['se', 'sw', 'nw', 'ne']}
        >
          {items.map(item => {
            const row = item.layout.y;
            const isRowHovered = hoveredRow === row;
            
            return (
              <div 
                key={item.layout.i} 
                className={`bg-white rounded-lg shadow-sm overflow-hidden
                  ${isRowHovered ? 'ring-2 ring-blue-200' : ''}`}
                onMouseEnter={() => setHoveredRow(row)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="drag-handle cursor-move p-2 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{item.type}</span>
                    <span className="text-xs text-gray-400">Width: {item.layout.w}/12</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const newWidth = Math.min(item.layout.w + 1, 12);
                        setItems(prev => prev.map(i => 
                          i.id === item.id 
                            ? { ...i, layout: { ...i.layout, w: newWidth } } 
                            : i
                        ));
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="Increase width"
                      title="Increase width"
                      disabled={item.layout.w >= 12}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const newWidth = Math.max(item.layout.w - 1, 1);
                        setItems(prev => prev.map(i => 
                          i.id === item.id 
                            ? { ...i, layout: { ...i.layout, w: newWidth } } 
                            : i
                        ));
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      aria-label="Decrease width"
                      title="Decrease width"
                      disabled={item.layout.w <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Delete item"
                      title="Delete item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="relative w-full h-[calc(100%-40px)]">
                  {item.type === 'text' ? (
                    <TextComponent
                      id={item.id}
                      content={item.content}
                      onEdit={(content) => {
                        setItems(prev => prev.map(i => 
                          i.id === item.id ? { ...i, content } : i
                        ));
                      }}
                    />
                  ) : (
                    <ImageComponent
                      id={item.id}
                      url={item.content}
                      onEdit={(url) => {
                        setItems(prev => prev.map(i => 
                          i.id === item.id ? { ...i, content: url } : i
                        ));
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
};
