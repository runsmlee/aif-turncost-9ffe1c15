import { forwardRef } from 'react';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  onValueChange?: (value: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, prefix, suffix, error, onValueChange, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? 0 : Number(e.target.value);
      onValueChange?.(value);
    };

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={props.id || props.name} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
        <div className="relative group">
          {prefix && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none z-10 transition-colors group-focus-within:text-brand-500">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            type="number"
            min={0}
            onChange={handleChange}
            className={`w-full h-11 rounded-xl border bg-white px-3.5 text-base text-gray-900 placeholder:text-gray-300 font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 hover:border-gray-400 ${
              prefix ? 'pl-8' : ''
            } ${suffix ? 'pr-10' : ''} ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
            } ${className}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${props.id || props.name}-error` : undefined}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none z-10 transition-colors group-focus-within:text-brand-500">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p id={`${props.id || props.name}-error`} className="text-xs text-red-600 font-medium flex items-center gap-1 animate-fade-in" role="alert">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
