import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, List, BarChart3, Settings, Moon, Sun } from "lucide-react";
import { useState } from "react";

const items = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/nova", icon: Plus, label: "Nova" },
  { path: "/viagens", icon: List, label: "Viagens" },
  { path: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { path: "/config", icon: Settings, label: "Config" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 safe-area-pb">
      {items.map((it) => {
        const active = pathname === it.path;
        return (
          <button
            key={it.path}
            onClick={() => navigate(it.path)}
            className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
              active ? "text-brand" : "text-gray-500"
            }`}
          >
            <it.icon size={22} />
            {it.label}
          </button>
        );
      })}
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center gap-0.5 text-xs text-gray-500"
      >
        {dark ? <Sun size={22} /> : <Moon size={22} />}
        Tema
      </button>
    </nav>
  );
}
