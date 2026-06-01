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
      <PageHeader title="Customers" description="Maintain customer records with unique email enforcement." />
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-4">
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
          <Button type="submit" className="w-full">Create</Button>
        </div>
      </form>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input className="w-full pl-9" placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <DataTable columns={columns} rows={customers} loading={loading} error={error} emptyTitle="No customers yet" emptyDescription="Add a customer before creating orders." />
    </div>
  );
}
