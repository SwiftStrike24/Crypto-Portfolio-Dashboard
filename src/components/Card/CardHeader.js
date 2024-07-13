// src/components/Card/CardHeader.js
import React from 'react';

const CardHeader = ({ children }) => (
  <div className="px-4 py-3 border-b border-gray-700 sm:px-6 dark:border-gray-600">
    {children}
  </div>
);

export default CardHeader;
