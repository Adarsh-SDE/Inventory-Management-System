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
        render: (row) => <span className={row.quantity < 10 ? "font-semibold text-red-600" : ""}>{row.quantity}</span>
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
      <PageHeader title="Products" description="Manage catalog items, SKU uniqueness, pricing, and stock levels." />
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-5">
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
        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full">{editingId ? "Update" : "Create"}</Button>
          {editingId ? <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button> : null}
        </div>
      </form>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input className="w-full pl-9" placeholder="Search by product or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <DataTable columns={columns} rows={products} loading={loading} error={error} emptyTitle="No products yet" emptyDescription="Create the first item to begin tracking inventory." />
    </div>
  );
}
