import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;
type CargoType = "milho" | "sorgo" | "soja" | "farelo_soja" | "outros";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onSaved: () => void;
  onDelete: (id: string) => void;
}

export default function TripDialog({ open, onOpenChange, trip, onSaved, onDelete }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "",
    origin: "",
    destination: "",
    cargo_type: "milho" as CargoType,
    custom_cargo_type: "",
    freight_value: 0,
    commission_percentage: 0,
    commission_value: 0,
    toll_value: 0,
    tax_value: 0,
    scheduling_value: 0,
    observations: "",
  });

  useEffect(() => {
    if (trip) {
      setForm({
        date: trip.date,
        origin: trip.origin,
        destination: trip.destination,
        cargo_type: trip.cargo_type,
        custom_cargo_type: trip.custom_cargo_type || "",
        freight_value: trip.freight_value,
        commission_percentage: trip.commission_percentage,
        commission_value: trip.commission_value,
        toll_value: trip.toll_value,
        tax_value: trip.tax_value,
        scheduling_value: trip.scheduling_value,
        observations: trip.observations || "",
      });
    } else {
      setForm({
        date: new Date().toISOString().split("T")[0],
        origin: "",
        destination: "",
        cargo_type: "milho",
        custom_cargo_type: "",
        freight_value: 0,
        commission_percentage: 10,
        commission_value: 0,
        toll_value: 0,
        tax_value: 0,
        scheduling_value: 0,
        observations: "",
      });
    }
  }, [trip, open]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "freight_value" || field === "commission_percentage") {
        const fv = field === "freight_value" ? Number(value) : prev.freight_value;
        const cp = field === "commission_percentage" ? Number(value) : prev.commission_percentage;
        next.commission_value = Number((fv * cp / 100).toFixed(2));
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, user_id: user!.id };

    const { error } = trip
      ? await supabase.from("trips").update(payload).eq("id", trip.id)
      : await supabase.from("trips").insert(payload);

    if (error) {
      toast.error("Erro ao salvar viagem");
    } else {
      toast.success(trip ? "Viagem atualizada" : "Viagem registrada");
      onOpenChange(false);
      onSaved();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{trip ? "Editar Viagem" : "Nova Viagem"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Data</Label>
              <Input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Tipo de Carga</Label>
              <Select value={form.cargo_type} onValueChange={(v) => updateField("cargo_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="milho">Milho</SelectItem>
                  <SelectItem value="sorgo">Sorgo</SelectItem>
                  <SelectItem value="soja">Soja</SelectItem>
                  <SelectItem value="farelo_soja">Farelo de Soja</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.cargo_type === "outros" && (
            <div className="space-y-1">
              <Label>Especifique a carga</Label>
              <Input value={form.custom_cargo_type} onChange={(e) => updateField("custom_cargo_type", e.target.value)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Origem</Label>
              <Input value={form.origin} onChange={(e) => updateField("origin", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Destino</Label>
              <Input value={form.destination} onChange={(e) => updateField("destination", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Valor do Frete (R$)</Label>
              <Input type="number" step="0.01" value={form.freight_value} onChange={(e) => updateField("freight_value", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Comissão (%)</Label>
              <Input type="number" step="0.1" value={form.commission_percentage} onChange={(e) => updateField("commission_percentage", Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Pedágio (R$)</Label>
              <Input type="number" step="0.01" value={form.toll_value} onChange={(e) => updateField("toll_value", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Impostos (R$)</Label>
              <Input type="number" step="0.01" value={form.tax_value} onChange={(e) => updateField("tax_value", Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Agendamento (R$)</Label>
              <Input type="number" step="0.01" value={form.scheduling_value} onChange={(e) => updateField("scheduling_value", Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Observações</Label>
            <Input value={form.observations} onChange={(e) => updateField("observations", e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
            {trip && (
              <Button type="button" variant="destructive" size="icon" onClick={() => { onDelete(trip.id); onOpenChange(false); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
