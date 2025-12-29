import React from 'react';

// --- Card ---
// Flatter, darker, clearer borders for a "panel" look
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-app-surface border border-app-border rounded-lg shadow-sm overflow-hidden ${noPadding ? '' : 'p-5'} ${className}`}>
    {children}
  </div>
);

// --- Button ---
// High contrast black/white for primary actions
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    // Pure white bg, black text for maximum pop
    primary: "bg-white text-black hover:bg-zinc-200 active:translate-y-px shadow-sm",
    // Dark surface, border, light text
    secondary: "bg-app-surface border border-app-border text-app-text hover:bg-app-hover hover:border-zinc-700 active:bg-zinc-800",
    // Transparent, subtle hover
    ghost: "bg-transparent text-app-muted hover:text-white hover:bg-app-hover",
    // Small icon button
    icon: "p-2 bg-transparent text-app-muted hover:text-white hover:bg-app-hover rounded-md aspect-square"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// --- Input ---
// Dark input field designed to look like a code editor input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, error, rightElement, className = '', ...props }) => (
  <div className="w-full space-y-1.5">
    {label && <label className="block text-xs font-medium text-app-muted uppercase tracking-wider pl-0.5">{label}</label>}
    <div className="relative group">
      <input
        className={`w-full bg-[#0d0d0d] border border-app-border rounded-md px-3 py-2 text-sm text-app-text placeholder-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors font-mono ${className} ${error ? 'border-red-900 focus:border-red-800' : ''}`}
        autoComplete="off"
        spellCheck="false"
        {...props}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="text-[10px] text-red-500 font-medium pl-0.5">{error}</p>}
  </div>
);

// --- Badge ---
// Minimalist tag
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'outline' }> = ({ children, variant = 'default' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight ${
    variant === 'outline' 
      ? 'border border-app-border text-app-muted' 
      : 'bg-app-hover text-app-text'
  }`}>
    {children}
  </span>
);

// --- Separator ---
export const Separator: React.FC = () => (
  <div className="h-px bg-app-border w-full my-4" />
);