import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart3, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Viagens" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/nova-viagem", icon: Plus, label: "Nova", accent: true },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on form pages
  if (location.pathname.startsWith("/editar-viagem")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                item.accent
                  ? "bg-accent text-accent-foreground rounded-full px-4 py-2 -mt-4 shadow-lg"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.accent && "w-5 h-5")} />
              {!item.accent && (
                <span className="text-[10px]">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
