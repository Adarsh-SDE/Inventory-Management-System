import { Loader2 } from "lucide-react";
import { StateBlock } from "./StateBlock.jsx";

export function DataTable({ columns, rows, loading, error, emptyTitle, emptyDescription }) {
  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-md border border-slate-200">
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
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-primary-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-semibold text-slate-600">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle text-slate-700">
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
