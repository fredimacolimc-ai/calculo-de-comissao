import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";

function AppContent() {
  const { session, loading, isDemo, signOut } = useAuth();

  if (loading) {
    return (
      <main className="app-shell">
        <p style={{ color: "hsl(var(--muted))" }}>Carregando...</p>
      </main>
    );
  }

  if (!session && !isDemo) {
    return <LoginScreen />;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <h1>Minhas Viagens</h1>
        <p className="description">
          Bem-vindo! O app está pronto para uso.
        </p>
        <button
          onClick={signOut}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.5rem",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            background: "transparent",
            color: "hsl(var(--muted))",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Sair
        </button>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}