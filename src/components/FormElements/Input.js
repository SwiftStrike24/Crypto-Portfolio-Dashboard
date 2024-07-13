// src/components/FormElements/Input.js
import React from 'react';

const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-white ${className}`}
  />
);

export default Input;
