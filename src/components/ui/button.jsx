import React from "react";

export function Button({ className = "", variant = "default", size = "default", asChild = false, children, ...props }) {
  const base = "inline-flex items-center justify-center transition disabled:opacity-50";
  const variants = {
    default: "bg-slate-900 text-white",
    outline: "border border-slate-200 bg-white text-slate-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
  };
  const classes = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: `${children.props.className || ""} ${classes}`.trim(),
    });
  }

  return <button className={classes} {...props}>{children}</button>;
}
