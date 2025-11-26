import React, { useState } from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled = false 
}) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#FF9500] to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:-translate-y-0.5",
    outline: "border border-gray-300/50 text-gray-700 hover:border-[#FF9500] hover:text-[#FF9500] hover:bg-orange-50/50 backdrop-blur-sm",
    ghost: "text-gray-600 hover:bg-black/5 hover:text-gray-900 backdrop-blur-sm",
    glass: "bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 shadow-sm hover:shadow-md",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:shadow-red-500/20"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-gray-200/20 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/30 hover:bg-white/70 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

interface BadgeProps {
  children?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: "bg-blue-50/80 text-blue-700 border-blue-200/50",
    green: "bg-green-50/80 text-green-700 border-green-200/50",
    orange: "bg-orange-50/80 text-orange-700 border-orange-200/50",
    red: "bg-red-50/80 text-red-700 border-red-200/50",
    gray: "bg-gray-50/80 text-gray-600 border-gray-200/50",
    purple: "bg-purple-50/80 text-purple-700 border-purple-200/50"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
    <input 
      className="w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] focus:bg-white/70 transition-all placeholder:text-gray-400 shadow-sm"
      {...props} 
    />
  </div>
);

export const TextArea = ({ label, className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
    <textarea 
      className={`w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] focus:bg-white/70 transition-all placeholder:text-gray-400 shadow-sm ${className}`}
      {...props} 
    />
  </div>
);

// --- CMS COMPONENTS ---

export const Tabs = ({ tabs, activeTab, onChange }: { tabs: string[], activeTab: string, onChange: (t: string) => void }) => (
  <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl mb-6 w-fit backdrop-blur-sm">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
          activeTab === tab 
          ? 'bg-white text-[#FF9500] shadow-sm' 
          : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export const Table = ({ headers, children }: { headers: string[], children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-2xl border border-gray-200/50 shadow-sm">
    <table className="w-full bg-white/40 backdrop-blur-md">
      <thead className="bg-gray-50/80">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {children}
      </tbody>
    </table>
  </div>
);