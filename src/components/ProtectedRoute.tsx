import { useAuth } from "@/contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="app-shell">
        <p style={{ color: "hsl(var(--muted))" }}>Carregando...</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
