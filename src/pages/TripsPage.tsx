import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { Plus, MapPin, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

const CARGO_LABELS: Record<string, string> = {
  milho: "Milho",
  sorgo: "Sorgo",
  soja: "Soja",
  farelo_soja: "Farelo de Soja",
  outros: "Outros",
};

export default function TripsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Tables<"trips">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar viagens");
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const deleteTrip = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta viagem?")) return;
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir viagem");
    } else {
      toast.success("Viagem excluída");
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Minhas Viagens</h1>
        <button
          onClick={() => navigate("/nova-viagem")}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Nova
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Nenhuma viagem registrada</p>
          <button
            onClick={() => navigate("/nova-viagem")}
            className="text-accent font-medium hover:underline text-sm"
          >
            Registrar primeira viagem
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-card rounded-xl p-4 border border-border space-y-2 active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/editar-viagem/${trip.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    {trip.origin} → {trip.destination}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(trip.date), "dd/MM/yyyy", { locale: ptBR })}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">
                      {CARGO_LABELS[trip.cargo_type] || trip.custom_cargo_type || trip.cargo_type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTrip(trip.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Frete: {formatCurrency(trip.freight_value)}
                </span>
                <span className="text-accent font-semibold">
                  Comissão: {formatCurrency(trip.commission_value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
