import { BarChart3, Boxes, Menu, Receipt, Users, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: Receipt }
];

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slateText">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <div className="text-base font-semibold">InventoryOS</div>
            <div className="text-xs text-slate-500">Operations console</div>
          </div>
          <button className="focus-ring rounded-md p-1 md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="grid gap-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-50 hover:text-slateText"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <button className="focus-ring rounded-md p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm text-slate-500 md:block">Inventory and order management</div>
          <div className="rounded-md border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
            Operations workspace
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
