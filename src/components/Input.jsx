import React from "react";
export const Input = ({ className, type, value, onChange, placeholder }) => {
  return (
    <input
      className={`${className}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
