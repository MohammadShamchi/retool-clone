import React, { useEffect, useState, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface PreviewModeProps {
  items: Array<{
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
  }>;
}

// Memoizing content components for better performance
const TextContent = memo(({ content }: { content: string }) => (
  <div className="prose max-w-none p-4 h-full overflow-y-auto">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
));

const ImageContent = memo(({ src }: { src: string }) => (
  <div className="w-full h-full relative">
    <img
      src={src}
      alt="Preview"
      className="absolute inset-0 w-full h-full object-contain"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
      }}
    />
  </div>
));

export const PreviewMode: React.FC<PreviewModeProps> = ({ items }) => {
  const [width, setWidth] = useState(window.innerWidth);
  
  // Handle window resizing - might need debouncing later
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width <= 768; // Breakpoint for mobile view
  const cols = 12;
  const rowHeight = 50;
  const margin = [10, 10];
  const containerPadding = [10, 10];

  // Sort by position for consistent display
  const sortedItems = [...items].sort((a, b) => {
    // Sort by rows first, then by column position
    if (a.layout.y === b.layout.y) {
      return a.layout.x - b.layout.x;
    }
    return a.layout.y - b.layout.y;
  });

  // Responsive layout adjustment
  const layouts = sortedItems.map(item => ({
    ...item.layout,
    w: isMobile ? 12 : item.layout.w, // Stack full width on mobile
    x: isMobile ? 0 : item.layout.x,
  }));

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto p-4">
        <GridLayout
          className="layout"
          layout={layouts}
          cols={cols}
          rowHeight={rowHeight}
          width={width - (isMobile ? 32 : 64)} // Adjust for container padding
          isDraggable={false}
          isResizable={false}
          margin={margin}
          containerPadding={containerPadding}
          compactType={null} // Keep layout exactly as designed
        >
          {sortedItems.map((item) => (
            <div 
              key={item.layout.i} 
              className="overflow-hidden bg-white rounded-lg"
              style={{
                height: `${item.layout.h * rowHeight - margin[1]}px`,
              }}
            >
              {item.type === 'text' 
                ? <TextContent content={item.content} />
                : <ImageContent src={item.content} />
              }
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
