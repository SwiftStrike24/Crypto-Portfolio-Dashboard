// src/components/FormElements/Button.js
import React from 'react';

const Button = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

export default Button;
