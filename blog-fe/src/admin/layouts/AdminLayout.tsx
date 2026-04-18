import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg border-r border-card-border p-spacing-lg">
        <a href="/admin" className="text-2xl font-bold text-primary block mb-spacing-lg">
          Admin Panel
        </a>
        <nav className="space-y-spacing-md">
          <a
            href="/admin"
            className="block px-spacing-md py-spacing-sm text-foreground hover:bg-muted rounded transition"
          >
            Dashboard
          </a>
          <a
            href="/admin/articles"
            className="block px-spacing-md py-spacing-sm text-foreground hover:bg-muted rounded transition"
          >
            Articles
          </a>
          <a
            href="/admin/users"
            className="block px-spacing-md py-spacing-sm text-foreground hover:bg-muted rounded transition"
          >
            Users
          </a>
          <a
            href="/logout"
            className="block px-spacing-md py-spacing-sm text-destructive hover:bg-muted rounded transition"
          >
            Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card-bg border-b border-card-border px-spacing-lg py-spacing-md">
          <h1 className="text-lg font-semibold text-foreground">Admin</h1>
        </header>

        {/* Content */}
        <div className="flex-1 p-spacing-lg overflow-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
