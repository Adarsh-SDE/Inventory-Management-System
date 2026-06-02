import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Field, Input } from "../components/Field.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAsyncResource } from "../hooks/useAsyncResource.js";
import { api } from "../services/api.js";
import { currency, dateTime } from "../utils/formatters.js";

export function OrdersPage() {
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { pushToast } = useToast();
  const { data: orders, loading, error, reload } = useAsyncResource(api.orders.list, []);
  const customersResource = useAsyncResource(() => api.customers.list(), []);
  const productsResource = useAsyncResource(() => api.products.list(), []);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const atRiskProducts = productsResource.data.filter((product) => product.quantity < 10).length;

  async function submit(event) {
    event.preventDefault();
    if (!customerId || !productId || Number(quantity) <= 0) {
      pushToast("Select a customer, product, and positive quantity.", "error");
      return;
    }
    try {
      await api.orders.create({
        customer_id: Number(customerId),
        items: [{ product_id: Number(productId), quantity: Number(quantity) }]
      });
      pushToast("Order created and stock updated");
      setProductId("");
      setQuantity(1);
      reload();
      productsResource.reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await api.orders.delete(id);
      pushToast("Order deleted");
      reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  const columns = useMemo(
    () => [
      { key: "id", label: "Order", render: (row) => `#${row.id}` },
      { key: "customer", label: "Customer", render: (row) => row.customer?.full_name || row.customer_id },
      { key: "items", label: "Items", render: (row) => row.items.map((item) => `${item.product?.name || item.product_id} x ${item.quantity}`).join(", ") },
      { key: "total_amount", label: "Total", render: (row) => currency(row.total_amount) },
      { key: "created_at", label: "Created", render: (row) => dateTime(row.created_at) },
      {
        key: "actions",
        label: "",
        render: (row) => (
          <div className="flex justify-end">
            <Button variant="danger" className="px-2" onClick={() => remove(row.id)} aria-label="Delete order">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="grid gap-6">
      <PageHeader title="Orders" description="Create orders with calculated totals, stock protection, and a clearer view of fulfillment pressure." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={submit} className="surface-panel grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="page-kicker">Order desk</div>
            <h2 className="section-title mt-2">Create a new order</h2>
          </div>
          <Field label="Customer">
            <select className="field-select" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
              <option value="">Select customer</option>
              {customersResource.data.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name}</option>)}
            </select>
          </Field>
          <Field label="Product">
            <select className="field-select" value={productId} onChange={(event) => setProductId(event.target.value)}>
              <option value="">Select product</option>
              {productsResource.data.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.quantity} left)</option>)}
            </select>
          </Field>
          <Field label="Quantity">
            <Input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="w-full"><Plus className="h-4 w-4" />Create order</Button>
          </div>
        </form>

        <section className="grid gap-4">
          <article className="surface-panel p-6">
            <div className="page-kicker">Order pulse</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Orders placed</div>
                <div className="metric-value mt-2">{loading ? "-" : orders.length}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Order value</div>
                <div className="metric-value mt-2">{loading ? "-" : currency(totalRevenue)}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Stock alerts</div>
                <div className="metric-value mt-2">{productsResource.loading ? "-" : atRiskProducts}</div>
              </div>
            </div>
          </article>
          <article className="surface-panel bg-primary-700 p-6 text-paper">
            <div className="page-kicker text-paper/60">Fulfillment note</div>
            <p className="mt-3 text-sm leading-7 text-paper/75">
              Orders reduce stock immediately, so the quantity shown in the product picker reflects the current live position after prior transactions.
            </p>
          </article>
        </section>
      </div>
      <DataTable columns={columns} rows={orders} loading={loading} error={error} emptyTitle="No orders yet" emptyDescription="Create an order once customers and products exist." />
    </div>
  );
}
