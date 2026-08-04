import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = 'h-[50px] rounded-lg font-headline-md flex items-center justify-center transition-colors px-4 w-full';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-container',
    secondary: 'bg-[#E9E9EB] text-primary hover:bg-[#d8d8d8]', // Using light gray from design system
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
