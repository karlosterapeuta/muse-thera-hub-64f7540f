
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the document base URL is correctly set for client-side routing
const baseElement = document.createElement('base');
baseElement.href = window.location.origin;
document.head.prepend(baseElement);

// Set initial theme
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);
