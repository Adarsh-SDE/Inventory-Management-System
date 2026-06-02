import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { DataTable } from "../components/DataTable.jsx";
import { Field, Input } from "../components/Field.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useAsyncResource } from "../hooks/useAsyncResource.js";
import { api } from "../services/api.js";

const emptyForm = { full_name: "", email: "", phone: "" };

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const { pushToast } = useToast();
  const { data: customers, loading, error, reload } = useAsyncResource(() => api.customers.list(search), [search]);
  const withBusinessEmail = customers.filter((customer) => !customer.email.endsWith("@gmail.com")).length;

  async function submit(event) {
    event.preventDefault();
    if (!form.full_name.trim() || !form.email.includes("@") || !form.phone.trim()) {
      pushToast("Enter a name, valid email, and phone number.", "error");
      return;
    }
    try {
      await api.customers.create(form);
      pushToast("Customer created");
      setForm(emptyForm);
      reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  async function remove(id) {
    try {
      await api.customers.delete(id);
      pushToast("Customer deleted");
      reload();
    } catch (err) {
      pushToast(err.message, "error");
    }
  }

  const columns = useMemo(
    () => [
      { key: "full_name", label: "Customer" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      {
        key: "actions",
        label: "",
        render: (row) => (
          <div className="flex justify-end">
            <Button variant="danger" className="px-2" onClick={() => remove(row.id)} aria-label="Delete customer">
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
      <PageHeader title="Customers" description="Maintain a cleaner customer book with fast add flow, searchable contact records, and email uniqueness guarded by the backend." />
      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <form onSubmit={submit} className="surface-panel grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="page-kicker">Relationship desk</div>
            <h2 className="section-title mt-2">Add a customer profile</h2>
          </div>
          <Field label="Full name">
            <Input value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Create customer</Button>
          </div>
        </form>

        <section className="grid gap-4">
          <article className="surface-panel p-6">
            <div className="page-kicker">Customer pulse</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Total contacts</div>
                <div className="metric-value mt-2">{loading ? "-" : customers.length}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Business emails</div>
                <div className="metric-value mt-2">{loading ? "-" : withBusinessEmail}</div>
              </div>
            </div>
          </article>
          <article className="surface-panel bg-primary-50/80 p-6">
            <div className="page-kicker">CRM note</div>
            <p className="mt-3 text-sm leading-7 text-muted">
              The search box is useful for quick lookups during order intake, while unique email validation keeps records from fragmenting into duplicates.
            </p>
          </article>
        </section>
      </div>

      <div className="surface-soft p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted" />
          <Input className="w-full pl-11" placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>
      <DataTable columns={columns} rows={customers} loading={loading} error={error} emptyTitle="No customers yet" emptyDescription="Add a customer before creating orders." />
    </div>
  );
}
