import { useState, useEffect } from 'react';
import './ScrollButtons.css';

function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show button if scrolled down more than 300px
      setIsVisible(scrollTop > 300);

      // Check if at bottom (within 100px)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
    };

    // Throttle scroll events for performance
    const handleScroll = () => {
      if (timeoutId) {
        return;
      }
      
      timeoutId = setTimeout(() => {
        toggleVisibility();
        timeoutId = null;
      }, 100); // Throttle to once every 100ms
    };

    window.addEventListener('scroll', handleScroll);
    toggleVisibility(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <div className="scroll-buttons">
          <button
            onClick={scrollToTop}
            className="scroll-button scroll-to-top"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            ↑
          </button>
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="scroll-button scroll-to-bottom"
              title="Scroll to bottom"
              aria-label="Scroll to bottom"
            >
              ↓
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ScrollButtons;
