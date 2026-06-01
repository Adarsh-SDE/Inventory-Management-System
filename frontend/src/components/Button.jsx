export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 border-primary-600",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border-slate-200",
    danger: "bg-white text-red-600 hover:bg-red-50 border-red-200"
  };

  return (
    <button
      className={`focus-ring inline-flex min-h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
