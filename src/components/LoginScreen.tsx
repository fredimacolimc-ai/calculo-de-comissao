import { useState } from "react";
import { lovable } from "@/integrations/lovable/index";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "0.5rem" }}>
          🚛 Minhas Viagens
        </h1>
        <p className="description" style={{ marginBottom: "2rem" }}>
          Controle de viagens e fretes
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.75rem",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? "Entrando..." : "Entrar com Google"}
        </button>

        {error && (
          <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.875rem" }}>
            {error}
          </p>
        )}
      </section>
    </main>
  );
}