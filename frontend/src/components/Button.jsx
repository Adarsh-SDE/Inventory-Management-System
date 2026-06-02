export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "border-primary-600 bg-primary-600 text-white hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-float",
    secondary: "border-line bg-white/80 text-ink hover:-translate-y-0.5 hover:border-primary-100 hover:bg-white hover:shadow-line",
    danger: "border-accent-100 bg-accent-50/80 text-accent-600 hover:-translate-y-0.5 hover:bg-accent-100"
  };

  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
