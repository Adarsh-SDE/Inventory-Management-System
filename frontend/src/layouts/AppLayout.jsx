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
    <div className="min-h-screen bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-12 h-64 w-64 rounded-full bg-accent-100/40 blur-3xl" />
        <div className="absolute right-[-5rem] top-32 h-72 w-72 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[18.5rem] border-r border-line/80 bg-ink text-paper shadow-card transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-paper/55">Northstar Suite</div>
              <div
                className="mt-2 text-3xl leading-none text-paper"
                style={{ fontFamily: "\"Cormorant Garamond\", Georgia, serif" }}
              >
                Inventory Atelier
              </div>
              <div className="mt-3 max-w-[13rem] text-sm leading-6 text-paper/65">
                Inventory, customer, and order operations with a quieter, editorial interface.
              </div>
            </div>
            <button className="focus-ring rounded-full border border-white/10 p-2 text-paper md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="grid gap-2 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-paper text-ink shadow-line"
                      : "text-paper/72 hover:bg-white/8 hover:text-paper"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-4 mt-auto rounded-[24px] border border-white/10 bg-white/5 p-4 text-paper/80">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-paper/55">Workflow note</div>
          <p className="mt-2 text-sm leading-6">
            Low-stock items are highlighted across the workspace so replenishment issues stand out early.
          </p>
        </div>
      </aside>

      <div className="relative md:pl-[18.5rem]">
        <header className="sticky top-0 z-30 px-4 pb-2 pt-4 md:px-8">
          <div className="surface-soft flex min-h-20 items-center justify-between px-4 py-3 md:px-6">
            <button className="focus-ring rounded-full border border-line bg-white/80 p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:block">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Control Room</div>
              <div className="mt-1 text-sm text-ink">A calmer command surface for catalog, customers, and order flow.</div>
            </div>
            <div className="rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-600">
              Live workspace
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
