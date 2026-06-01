import { AlertCircle, Inbox } from "lucide-react";

export function StateBlock({ type = "empty", title, description }) {
  const Icon = type === "error" ? AlertCircle : Inbox;
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <Icon className={type === "error" ? "h-6 w-6 text-red-500" : "h-6 w-6 text-slate-400"} />
      <h2 className="mt-3 text-sm font-semibold text-slateText">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}
