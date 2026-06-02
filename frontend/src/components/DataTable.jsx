import { Loader2 } from "lucide-react";
import { StateBlock } from "./StateBlock.jsx";

export function DataTable({ columns, rows, loading, error, emptyTitle, emptyDescription }) {
  if (loading) {
    return (
      <div className="surface-panel flex min-h-56 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return <StateBlock type="error" title="Unable to load data" description={error} />;
  }

  if (!rows.length) {
    return <StateBlock title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="surface-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line/80 text-sm">
          <thead className="bg-white/70">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rows.map((row) => (
              <tr key={row.id} className="bg-transparent transition hover:bg-white/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-middle text-ink">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
