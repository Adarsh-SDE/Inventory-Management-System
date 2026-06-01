import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";

export function NotFoundPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Page not found" description="The requested workspace page does not exist." />
      <div>
        <Link
          to="/"
          className="focus-ring inline-flex min-h-9 items-center justify-center rounded-md border border-primary-600 bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
