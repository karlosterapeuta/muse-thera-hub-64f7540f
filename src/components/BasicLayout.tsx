import React from "react";
import { Outlet } from "react-router-dom";

interface BasicLayoutProps {
  children?: React.ReactNode;
}

export default function BasicLayout({ children }: BasicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">MuseTera</h1>
      </header>
      <main className="p-4">
        {children || <Outlet />}
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2025 MuseTera • Plataforma de Musicoterapia
      </footer>
    </div>
  );
}