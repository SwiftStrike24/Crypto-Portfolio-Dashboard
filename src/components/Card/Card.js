// src/components/Card/Card.js
import React from 'react';

const Card = ({ children, className }) => (
  <div className={`bg-gray-800 shadow-lg rounded-lg ${className} hover:transform hover:scale-105 transition-transform duration-200 dark:bg-gray-800`}>
    {children}
  </div>
);

export default Card;
