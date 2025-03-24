'use client';

import { useEffect } from 'react';

/**
 * Custom hook to remove Spline watermark programmatically
 */
export const useRemoveWatermark = () => {
  useEffect(() => {
    // Add a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      try {
        // Function to find and remove the watermark
        const removeWatermark = () => {
          // Try multiple selectors that might match the watermark
          const selectors = [
            'div[style*="position: fixed"][style*="bottom: 8px"][style*="right: 8px"]',
            'div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]',
            'div[style*="z-index: 999"]',
            'a[href*="spline.design"]',
            '[class*="watermark"]'
          ];
    
          // Look for elements that might be the watermark
          selectors.forEach(selector => {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                // Check if the element or its children contain "Built with Spline" text
                try {
                  if (
                    el.textContent?.includes('Built with Spline') || 
                    el.innerHTML?.includes('Built with Spline') ||
                    (el as HTMLElement).style?.zIndex === '999' ||
                    (el as HTMLAnchorElement).href?.includes('spline.design')
                  ) {
                    // Hide the element
                    (el as HTMLElement).style.display = 'none';
                    (el as HTMLElement).style.opacity = '0';
                    (el as HTMLElement).style.visibility = 'hidden';
                    (el as HTMLElement).style.pointerEvents = 'none';
                  }
                } catch (innerErr) {
                  console.log('Error processing element:', innerErr);
                }
              });
            } catch (err) {
              console.log('Error with selector:', selector, err);
            }
          });
        };
    
        // Initial removal
        removeWatermark();
    
        // Set up an observer to detect DOM changes
        let observer: MutationObserver | null = null;
        try {
          observer = new MutationObserver(() => {
            try {
              removeWatermark();
            } catch (err) {
              console.log('Error in observer callback:', err);
            }
          });
      
          // Start observing with safer parameters
          observer.observe(document.body, { 
            childList: true, 
            subtree: true
          });
        } catch (err) {
          console.log('Error setting up observer:', err);
        }
    
        // Cleanup function
        return () => {
          if (observer) {
            observer.disconnect();
          }
        };
      } catch (err) {
        console.log('Error in watermark hook:', err);
      }
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timeoutId);
  }, []);
};

export default useRemoveWatermark; 