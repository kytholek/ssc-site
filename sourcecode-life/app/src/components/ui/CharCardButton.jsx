import React from 'react';
import { useAppDispatch } from '../../context/AppContext';

export default function CharCardButton({ children, onClick, className = '' }) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // Navigate to config tab (blueprint section)
    dispatch({ type: 'SET_TAB', payload: 'config' });
    window.location.hash = '#blueprint';
    if (onClick) onClick();
  };

  return (
    <button
      className={`char-card-open-btn ${className}`}
      onClick={handleClick}
    >
      <span className="char-card-open-btn-icon">◇</span>
      {children}
    </button>
  );
}

