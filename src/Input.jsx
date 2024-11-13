import React from "react";

const Input = React.forwardRef(({ id, suffix, ...props }, ref) => {
  return (
    <div className="relative mt-2 rounded-md shadow-sm">
      <input
        ref={ref}
        id={id}
        name={id}
        type="text"
        className="block w-full rounded-md border-0 py-1.5 pr-10 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
        {...props}
      />
      {!!suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span id="price-currency" className="text-gray-500 sm:text-sm">
            {suffix}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
