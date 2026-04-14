/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import Calculator from './components/Calculator';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Use ResizeObserver to detect height changes (e.g., when table rows are added/removed)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // We use the scrollHeight of the target to get the full content height
        const height = entry.target.scrollHeight;
        
        // Send the height to the parent window (Shopify)
        window.parent.postMessage({ 
          type: 'resize', 
          height: height 
        }, '*');
      }
    });

    resizeObserver.observe(containerRef.current);

    // Also send an initial height message
    const initialHeight = containerRef.current.scrollHeight;
    window.parent.postMessage({ type: 'resize', height: initialHeight }, '*');

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="bg-transparent selection:bg-brand-red/30 overflow-hidden">
      <main className="relative z-10">
        <Calculator />
      </main>
    </div>
  );
}
