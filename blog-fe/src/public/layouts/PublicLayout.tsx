import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  children?: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-card-bg border-b border-card-border sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-spacing-md py-spacing-md flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-primary">
            Blog
          </a>
          <div className="flex gap-spacing-lg">
            <a href="/" className="text-foreground hover:text-primary transition">
              Home
            </a>
            <a href="/articles" className="text-foreground hover:text-primary transition">
              Articles
            </a>
            <a href="/login" className="text-foreground hover:text-primary transition">
              Login
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-spacing-md py-spacing-lg">
        {children ?? <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-card-border mt-spacing-2xl">
        <div className="max-w-7xl mx-auto px-spacing-md py-spacing-lg text-center text-muted-foreground">
          <p>&copy; 2024 Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
