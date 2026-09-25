import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  headerRight?: ReactNode;
  rightElement?: ReactNode;
  inputClassName?: string;
}

export const Input = ({
  id,
  label,
  error,
  headerRight,
  rightElement,
  className = "",
  inputClassName = "",
  disabled,
  ...props
}: InputProps) => {
  return (
    <div className={`w-full ${className}`}>
      {(label || headerRight) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              htmlFor={id}
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              {label}
            </label>
          )}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            rightElement ? "pr-12" : ""
          } ${
            error
              ? "border-rose-400 focus:ring-rose-400 focus:border-rose-400"
              : "border-slate-300 focus:ring-slate-900 focus:border-transparent"
          } ${inputClassName}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
};
