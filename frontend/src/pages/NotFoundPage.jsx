import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";

export function NotFoundPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Page not found" description="The requested workspace page does not exist." />
      <div className="surface-panel p-8">
        <Link
          to="/"
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-700"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
