export function Field({ label, error, children }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{label}</span>
      {children}
      {error ? <span className="text-xs text-accent-600">{error}</span> : null}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      className="field-input"
      {...props}
    />
  );
}
