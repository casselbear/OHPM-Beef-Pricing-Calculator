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
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);
    
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
