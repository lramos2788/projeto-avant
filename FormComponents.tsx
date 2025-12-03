import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subLabel?: string;
  fullWidth?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  subLabel?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const FormSection: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; isActive: boolean }> = ({ 
  title, subtitle, children, isActive 
}) => {
  if (!isActive) return null;
  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};

export const Input: React.FC<InputProps> = ({ label, subLabel, fullWidth = false, className, ...props }) => (
  <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {subLabel && <p className="text-xs text-slate-500 mb-2">{subLabel}</p>}
    <input
      className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${className}`}
      {...props}
    />
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({ label, subLabel, className, ...props }) => (
  <div className="col-span-1 md:col-span-2">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {subLabel && <p className="text-xs text-slate-500 mb-2">{subLabel}</p>}
    <textarea
      rows={3}
      className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="col-span-1">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <select
      className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${className}`}
      {...props}
    >
      <option value="">Selecione...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);