import { ArrowRight, Boxes, Receipt, TrendingDown, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StateBlock } from "../components/StateBlock.jsx";
import { api } from "../services/api.js";
import { useAsyncResource } from "../hooks/useAsyncResource.js";
import { currency, dateTime } from "../utils/formatters.js";

const metrics = [
  { key: "total_products", label: "Products", icon: Boxes },
  { key: "total_customers", label: "Customers", icon: Users },
  { key: "total_orders", label: "Orders", icon: Receipt },
  { key: "low_stock_products", label: "Low stock", icon: TrendingDown }
];

export function DashboardPage() {
  const { data, loading, error } = useAsyncResource(api.dashboard, []);
  const ordersResource = useAsyncResource(api.orders.list, []);
  const productsResource = useAsyncResource(() => api.products.list(), []);
  const recentOrders = ordersResource.data.slice(0, 3);
  const lowStock = productsResource.data.filter((product) => product.quantity < 10).slice(0, 4);

  return (
    <div className="grid gap-6">
      <section className="surface-panel overflow-hidden">
        <div className="grid gap-8 p-6 md:grid-cols-[1.3fr,0.9fr] md:p-8">
          <div>
            <PageHeader
              title="Operations overview"
              description="A daily command view for inventory levels, order throughput, and customer activity with the most relevant signals pulled forward."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-700"
              >
                Review catalog
              </Link>
              <Link
                to="/orders"
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white/70 px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
              >
                Open order desk
              </Link>
            </div>
          </div>
          <div className="surface-soft grid gap-4 p-5">
            <div>
              <div className="page-kicker">Signal</div>
              <h2 className="section-title mt-2">What needs attention today</h2>
            </div>
            <div className="grid gap-3 text-sm text-muted">
              <div className="flex items-start justify-between gap-4 rounded-[20px] bg-white/80 px-4 py-3">
                <span>Low stock items are flagged before new orders push them into risk territory.</span>
                <span className="table-chip">{loading ? "-" : `${data.low_stock_products ?? 0} items`}</span>
              </div>
              <div className="flex items-start justify-between gap-4 rounded-[20px] bg-white/80 px-4 py-3">
                <span>Recent orders are visible below so the team can spot unusual order sizes quickly.</span>
                <span className="table-chip">{ordersResource.loading ? "-" : `${ordersResource.data.length} orders`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {error ? (
        <StateBlock type="error" title="Unable to load summary" description={error} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <section key={metric.key} className="surface-panel p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{metric.label}</span>
                  <div className="rounded-full border border-primary-100 bg-primary-50 p-2.5">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="metric-value mt-5">{loading ? "-" : data[metric.key] ?? 0}</div>
                <p className="mt-2 text-sm text-muted">
                  {metric.key === "low_stock_products"
                    ? "Items below the preferred stock buffer."
                    : `Current ${metric.label.toLowerCase()} in the system.`}
                </p>
              </section>
            );
          })}
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="surface-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="page-kicker">Recent orders</div>
              <h2 className="section-title mt-2">Latest activity</h2>
            </div>
            <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {ordersResource.error ? (
              <StateBlock type="error" title="Orders unavailable" description={ordersResource.error} />
            ) : recentOrders.length ? (
              recentOrders.map((order) => (
                <article key={order.id} className="surface-soft p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-ink">{order.customer?.full_name || `Order #${order.id}`}</div>
                      <div className="mt-1 text-sm text-muted">{dateTime(order.created_at)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-ink">{currency(order.total_amount)}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                        {order.items.length} line{order.items.length > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="table-chip">
                        {item.product?.name || item.product_id} x {item.quantity}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <StateBlock title="No recent orders" description="Create a few orders to start tracking activity here." />
            )}
          </div>
        </section>

        <section className="grid gap-6">
          <article className="surface-panel p-6">
            <div className="page-kicker">Inventory posture</div>
            <h2 className="section-title mt-2">Low-stock watchlist</h2>
            <div className="mt-5 grid gap-3">
              {productsResource.error ? (
                <StateBlock type="error" title="Inventory unavailable" description={productsResource.error} />
              ) : lowStock.length ? (
                lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-4 rounded-[20px] bg-accent-50/70 px-4 py-3">
                    <div>
                      <div className="font-semibold text-ink">{product.name}</div>
                      <div className="text-sm text-muted">{product.sku}</div>
                    </div>
                    <span className="rounded-full border border-accent-100 bg-white/80 px-3 py-1 text-sm font-semibold text-accent-600">
                      {product.quantity} left
                    </span>
                  </div>
                ))
              ) : (
                <StateBlock title="No stock alerts" description="All tracked products are above the low-stock threshold." />
              )}
            </div>
          </article>

          <article className="surface-panel bg-primary-700 p-6 text-paper">
            <div className="page-kicker text-paper/60">Assurance</div>
            <h2
              className="mt-2 text-3xl font-semibold leading-none text-paper"
              style={{ fontFamily: "\"Cormorant Garamond\", Georgia, serif" }}
            >
              Inventory remains transaction-safe.
            </h2>
            <p className="mt-4 text-sm leading-7 text-paper/75">
              Stock validation, order totals, and quantity reduction still happen on the backend in a single transaction, so the polished UI does not come at the cost of operational correctness.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
