export function Input({ className = "", ...props }) {
  return <input className={`h-10 w-full border border-slate-200 bg-white px-3 py-2 outline-none ${className}`} {...props} />;
}
