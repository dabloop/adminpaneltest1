// ContentTransition.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ContentTransition.css';

function ContentTransition({ children }) {
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [isTransitioningIn, setIsTransitioningIn] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Trigger exit transition
    setIsTransitioningOut(true);
    setIsTransitioningIn(false);

    // After the exit transition, update content and trigger entry transition
    const exitTimer = setTimeout(() => {
      setCurrentChildren(children); // Update to the new content
      setIsTransitioningOut(false);
      setIsTransitioningIn(true); // Start the entry transition
    }, 300); // Duration should match CSS animation time

    return () => clearTimeout(exitTimer);
  }, [location.pathname, children]);

  return (
    <div
      className={`content-wrapper ${
        isTransitioningOut ? 'vanish' : isTransitioningIn ? 'appear' : ''
      }`}
    >
      {currentChildren}
    </div>
  );
}

export default ContentTransition;
