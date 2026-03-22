import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, CARGO_LABELS } from "@/lib/utils";
import { Plus, LogOut, User, Truck, DollarSign, MapPin } from "lucide-react";
import TripDialog from "@/components/TripDialog";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Trip = Tables<"trips">;

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user!.id)
      .order("date", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar viagens");
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir viagem");
    } else {
      toast.success("Viagem excluída");
      fetchTrips();
    }
  };

  const totalFreight = trips.reduce((s, t) => s + t.freight_value, 0);
  const totalCommission = trips.reduce((s, t) => s + t.commission_value, 0);
  const netValue = totalFreight - totalCommission - trips.reduce((s, t) => s + t.toll_value + t.tax_value + t.scheduling_value, 0);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <span className="font-bold">Minhas Viagens</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/perfil")}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mt-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary p-2"><DollarSign className="h-5 w-5 text-primary-foreground" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Frete Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalFreight)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-secondary p-2"><DollarSign className="h-5 w-5 text-secondary-foreground" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Comissão Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalCommission)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-accent p-2"><DollarSign className="h-5 w-5 text-accent-foreground" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Líquido</p>
                <p className="text-lg font-bold">{formatCurrency(netValue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trip list */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Viagens ({trips.length})</h2>
          <Button size="sm" onClick={() => { setEditingTrip(null); setDialogOpen(true); }}>
            <Plus className="mr-1 h-4 w-4" /> Nova
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : trips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MapPin className="mx-auto h-10 w-10 mb-2 opacity-40" />
              <p>Nenhuma viagem registrada</p>
              <p className="text-sm">Clique em "Nova" para adicionar sua primeira viagem.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="cursor-pointer hover:border-accent/50 transition-colors" onClick={() => { setEditingTrip(trip); setDialogOpen(true); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{trip.origin} → {trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(trip.date), "dd/MM/yyyy", { locale: ptBR })} · {CARGO_LABELS[trip.cargo_type] || trip.custom_cargo_type || trip.cargo_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">{formatCurrency(trip.freight_value)}</p>
                      <p className="text-xs text-muted-foreground">Comissão: {formatCurrency(trip.commission_value)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <TripDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trip={editingTrip}
        onSaved={fetchTrips}
        onDelete={handleDelete}
      />
    </div>
  );
}
