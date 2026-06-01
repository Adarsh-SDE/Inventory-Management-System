export function Field({ label, error, children }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      className="focus-ring h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slateText placeholder:text-slate-400"
      {...props}
    />
  );
}
