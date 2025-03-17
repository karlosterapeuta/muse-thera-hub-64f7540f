
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure proper theme class is applied to the root element
const theme = localStorage.getItem('museterapia-theme') || 'light';
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);
