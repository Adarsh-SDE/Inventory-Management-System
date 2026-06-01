import { Boxes, Receipt, TrendingDown, Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StateBlock } from "../components/StateBlock.jsx";
import { api } from "../services/api.js";
import { useAsyncResource } from "../hooks/useAsyncResource.js";

const metrics = [
  { key: "total_products", label: "Products", icon: Boxes },
  { key: "total_customers", label: "Customers", icon: Users },
  { key: "total_orders", label: "Orders", icon: Receipt },
  { key: "low_stock_products", label: "Low stock", icon: TrendingDown }
];

export function DashboardPage() {
  const { data, loading, error } = useAsyncResource(api.dashboard, []);

  return (
    <div className="grid gap-6">
      <PageHeader title="Dashboard" description="Operational snapshot for inventory, customers, orders, and low stock risk." />
      {error ? (
        <StateBlock type="error" title="Unable to load summary" description={error} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <section key={metric.key} className="rounded-md border border-slate-200 bg-white p-5 shadow-line">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{metric.label}</span>
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="mt-4 text-3xl font-semibold text-slateText">{loading ? "-" : data[metric.key] ?? 0}</div>
              </section>
            );
          })}
        </div>
      )}
      <section className="rounded-md border border-slate-200 bg-primary-50 p-5">
        <h2 className="text-sm font-semibold text-slateText">Inventory posture</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Stock is treated as a first-class business invariant. The backend validates quantity before each order and commits
          the order with inventory reduction in one transaction.
        </p>
      </section>
    </div>
  );
}
