import * as React from "react";

import { cn } from "../../utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <>
        <div className="relative">
          {icon && (
            <div className="absolute ml-3 mt-3">
              {React.cloneElement(icon, {
                className: "text-white dark:text-gray-300",
              })}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-600 dark:text-white",
              className,
              icon ? "pl-9" : "",
            )}
            ref={ref}
            {...props}
          />
        </div>
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
