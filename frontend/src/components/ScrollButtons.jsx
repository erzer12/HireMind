import { useState, useEffect } from 'react';
import './ScrollButtons.css';

function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show button if scrolled down more than 300px
      setIsVisible(scrollTop > 300);

      // Check if at bottom (within 100px)
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Check initial state

    return () => window.removeEventListener('scroll', toggleVisibility);
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
