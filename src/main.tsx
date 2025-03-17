
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the theme from localStorage and apply it immediately to prevent flash
const theme = localStorage.getItem('museterapia-theme') || 'light';
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(theme);

console.log("Initial theme applied:", theme);

createRoot(document.getElementById("root")!).render(<App />);
