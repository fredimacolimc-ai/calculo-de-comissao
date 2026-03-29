import { useAuth } from "@/contexts/AuthProvider";
import { lovable } from "@/integrations/lovable/index";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { LogIn } from "lucide-react";

export default function Login() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  if (loading) {
    return (
      <main className="app-shell">
        <p style={{ color: "hsl(var(--muted))" }}>Carregando...</p>
      </main>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    setError(null);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setError("Falha ao entrar com Google. Tente novamente.");
      setSigningIn(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "0.5rem" }}>
          Minhas Viagens
        </h1>
        <p className="description" style={{ marginBottom: "2rem" }}>
          Gerencie suas viagens e comissões de frete
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={signingIn}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 2rem",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.75rem",
            background: "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: signingIn ? "wait" : "pointer",
            opacity: signingIn ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <LogIn size={20} />
          {signingIn ? "Entrando..." : "Entrar com Google"}
        </button>

        {error && (
          <p style={{ color: "#f87171", marginTop: "1rem", fontSize: "0.875rem" }}>
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
