import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setMessage("Verifique seu e-mail para confirmar o cadastro.");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else navigate("/");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}>
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Truck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Minhas Viagens</h1>
          <p className="text-white/70 text-sm">Controle de Viagens</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/50"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/50"
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          {message && <p className="text-green-300 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-brand font-semibold hover:bg-white/90 transition disabled:opacity-50"
          >
            {loading ? "Aguarde..." : isSignUp ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-3 py-3 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition"
        >
          Entrar com Google
        </button>

        <p className="text-center text-white/70 text-sm mt-4">
          {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            className="text-white underline">
            {isSignUp ? "Entrar" : "Cadastrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
