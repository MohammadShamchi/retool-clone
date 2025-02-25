# Drag-and-Drop Page Builder

A modern, React-based drag-and-drop page builder that allows users to create responsive layouts with text and image components.

## Features

- **Intuitive Drag and Drop**: Easy-to-use interface for building layouts
- **Responsive Grid System**: Components automatically adjust to screen size
- **Multiple Component Types**:
  - Text Component with Markdown support
  - Image Component with URL input
- **Real-time Preview**: See your changes as you build
- **Row-based Layout**: Place multiple components side by side
- **Component Resizing**: Resize components from any corner
- **Clean UI**: Modern and minimalist design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- React Grid Layout
- React DnD
- React Markdown

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`

3. **Build**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/         # React components
│   ├── Canvas.tsx     # Main drag-and-drop canvas
│   ├── ImageComponent # Image component with URL input
│   ├── PreviewMode    # Preview mode for final layout
│   └── TextComponent  # Text component with markdown
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Usage

1. **Adding Components**:
   - Drag components from the left sidebar onto the canvas
   - Components can be placed side by side in the same row

2. **Editing Components**:
   - Text: Click to edit markdown content
   - Image: Enter image URL in the input field

3. **Layout Management**:
   - Drag components to reposition
   - Use corner handles to resize
   - Components automatically align in rows

4. **Preview Mode**:
   - Click "Preview" to see the final layout
   - Preview mode is fully responsive

## Development Practices

- TypeScript for type safety
- Modular component architecture
- Responsive design principles
- Clean code practices
- Performance optimized

## License

MIT License - feel free to use this project for any purpose.
