import { AlertCircle, Inbox } from "lucide-react";

export function StateBlock({ type = "empty", title, description }) {
  const Icon = type === "error" ? AlertCircle : Inbox;
  return (
    <div className="surface-panel flex min-h-56 flex-col items-center justify-center px-8 text-center">
      <div className={`rounded-full border p-4 ${type === "error" ? "border-accent-100 bg-accent-50" : "border-primary-100 bg-primary-50"}`}>
        <Icon className={type === "error" ? "h-6 w-6 text-accent-600" : "h-6 w-6 text-primary-600"} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
