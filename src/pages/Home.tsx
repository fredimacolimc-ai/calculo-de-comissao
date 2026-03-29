import { useAuth } from "@/contexts/AuthProvider";
import { LogOut } from "lucide-react";

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Bem-vindo</p>
        <h1>Minhas Viagens</h1>
        <p className="description">
          Olá, {user?.user_metadata?.full_name || user?.email}
        </p>
        <button
          onClick={signOut}
          style={{
            marginTop: "1.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.75rem",
            background: "transparent",
            color: "hsl(var(--muted))",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </section>
    </main>
  );
}
