export function Badge({ className = "", children, ...props }) {
  return <span className={`inline-flex items-center ${className}`} {...props}>{children}</span>;
}
