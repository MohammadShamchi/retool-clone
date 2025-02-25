// Allow importing CSS files
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Declare missing library modules
declare module 'react-grid-layout';
declare module 'react-grid-layout/css/styles.css';
declare module 'react-resizable/css/styles.css'; 
