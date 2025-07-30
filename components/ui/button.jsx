'use client';

import React from 'react';
import classNames from 'classnames';

const Button = ({ children, onClick, type = 'button', variant = 'default', className = '', ...props }) => {
  const baseClasses =
    'px-4 py-2 rounded text-sm font-medium focus:outline-none transition-colors duration-200';

  const variants = {
    default: 'bg-orange-600 text-white hover:bg-orange-700',
    outline: 'border border-gray-400 text-black hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  const finalClass = classNames(baseClasses, variants[variant], className);

  return (
    <button type={type} onClick={onClick} className={finalClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
