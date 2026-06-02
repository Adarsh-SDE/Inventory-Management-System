import { Edit2, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Field, Input } from "../components/Field.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAsyncResource } from "../hooks/useAsyncResource.js";
import { api } from "../services/api.js";
import { currency } from "../utils/formatters.js";

const emptyForm = { product_name: "", sku: "", price: "", quantity: "" };

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const { pushToast } = useToast();
  const { data: products, loading, error, reload } = useAsyncResource(() => api.products.list(search), [search]);
  const totalUnits = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
  const lowStockCount = products.filter((product) => product.quantity < 10).length;

  const isValid = form.product_name.trim() && form.sku.trim() && Number(form.price) > 0 && Number(form.quantity) >= 0;

  async function submit(event) {
    event.preventDefault();
    if (!isValid) {
      pushToast("Complete product fields with a positive price and non-negative quantity.", "error");
      return;
    }
    try {
      const payload = { ...form, price: String(form.price), quantity: Number(form.quantity) };
      if (editingId) {
        await api.products.update(editingId, payload);
        pushToast("Product updated");
      } else {
        await api.products.create(payload);
        pushToast("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await api.products.delete(id);
      pushToast("Product deleted");
      reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  const columns = useMemo(
    () => [
      { key: "name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "price", label: "Price", render: (row) => currency(row.price) },
      {
        key: "quantity",
        label: "Quantity",
        render: (row) => (
          <span className={row.quantity < 10 ? "rounded-full border border-accent-100 bg-accent-50 px-3 py-1 font-semibold text-accent-600" : "rounded-full border border-primary-100 bg-primary-50 px-3 py-1 font-semibold text-primary-700"}>
            {row.quantity}
          </span>
        )
      },
      {
        key: "actions",
        label: "",
        render: (row) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="px-2"
              onClick={() => {
                setEditingId(row.id);
                setForm({ product_name: row.name, sku: row.sku, price: row.price, quantity: row.quantity });
              }}
              aria-label="Edit product"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="danger" className="px-2" onClick={() => remove(row.id)} aria-label="Delete product">
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
      <PageHeader title="Products" description="Manage the catalog with clearer stock signals, cleaner merchandising fields, and a faster editing rhythm." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <form onSubmit={submit} className="surface-panel grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2 flex items-start justify-between gap-4">
            <div>
              <div className="page-kicker">Catalog editor</div>
              <h2 className="section-title mt-2">{editingId ? "Refine product details" : "Add a new product"}</h2>
            </div>
            {editingId ? <span className="table-chip">Editing live item</span> : null}
          </div>
          <Field label="Product name">
            <Input value={form.product_name} onChange={(event) => setForm({ ...form, product_name: event.target.value })} />
          </Field>
          <Field label="SKU">
            <Input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
          </Field>
          <Field label="Price">
            <Input type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          </Field>
          <Field label="Quantity">
            <Input type="number" min="0" step="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
          </Field>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit">{editingId ? "Update product" : "Create product"}</Button>
            {editingId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        <section className="grid gap-4">
          <article className="surface-panel p-6">
            <div className="page-kicker">Catalog pulse</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Tracked products</div>
                <div className="metric-value mt-2">{loading ? "-" : products.length}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Units on hand</div>
                <div className="metric-value mt-2">{loading ? "-" : totalUnits}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Low stock</div>
                <div className="metric-value mt-2">{loading ? "-" : lowStockCount}</div>
              </div>
            </div>
          </article>
          <article className="surface-panel bg-accent-50/70 p-6">
            <div className="page-kicker text-accent-600">Merchandising note</div>
            <p className="mt-3 text-sm leading-7 text-muted">
              Keep SKU formatting consistent and use the low-stock markers in the table to spot replenishment needs before order creation stalls.
            </p>
          </article>
        </section>
      </div>

      <div className="surface-soft p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted" />
          <Input className="w-full pl-11" placeholder="Search by product or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>
      <DataTable columns={columns} rows={products} loading={loading} error={error} emptyTitle="No products yet" emptyDescription="Create the first item to begin tracking inventory." />
    </div>
  );
}
