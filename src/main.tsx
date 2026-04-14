import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Standard root rendering for local development
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// Custom Element definition for Shopify integration
class BeefCalculatorElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    
    // Create a style element to hold our CSS
    const style = document.createElement('style');
    // We'll try to find the injected styles and copy them into the shadow root
    // This works well with vite-plugin-css-injected-by-js
    const existingStyles = document.querySelectorAll('style');
    existingStyles.forEach(s => {
      if (s.textContent?.includes('tailwindcss') || s.textContent?.includes('--tw-')) {
        style.textContent += s.textContent;
      }
    });
    
    shadow.appendChild(style);
    shadow.appendChild(mountPoint);
    
    createRoot(mountPoint).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

if (!customElements.get('beef-calculator')) {
  customElements.define('beef-calculator', BeefCalculatorElement);
}
