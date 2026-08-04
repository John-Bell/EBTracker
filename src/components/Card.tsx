import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ icon, className = '', children, ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-card p-[16px] ${className}`} {...props}>
      {icon && (
        <div className="mb-4 text-primary">
          {icon}
        </div>
      )}
      {children}
    </div>
  );
};
