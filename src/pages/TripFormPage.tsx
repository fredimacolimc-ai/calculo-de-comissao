import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toCents, fromCents } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
import type { Database } from "@/integrations/supabase/types";

type CargoType = Database["public"]["Enums"]["cargo_type"];

const CARGO_OPTIONS: { value: CargoType; label: string }[] = [
  { value: "milho", label: "Milho" },
  { value: "sorgo", label: "Sorgo" },
  { value: "soja", label: "Soja" },
  { value: "farelo_soja", label: "Farelo de Soja" },
  { value: "outros", label: "Outros" },
];

export default function TripFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    origin: "",
    destination: "",
    cargo_type: "soja" as CargoType,
    custom_cargo_type: "",
    freight_value: "",
    commission_percentage: "",
    toll_value: "",
    tax_value: "",
    scheduling_value: "",
    observations: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast.error("Viagem não encontrada");
            navigate("/");
            return;
          }
          setForm({
            date: data.date,
            origin: data.origin,
            destination: data.destination,
            cargo_type: data.cargo_type,
            custom_cargo_type: data.custom_cargo_type || "",
            freight_value: fromCents(data.freight_value).toString(),
            commission_percentage: data.commission_percentage.toString(),
            toll_value: fromCents(data.toll_value).toString(),
            tax_value: fromCents(data.tax_value).toString(),
            scheduling_value: fromCents(data.scheduling_value).toString(),
            observations: data.observations || "",
          });
        });
    }
  }, [id]);

  const freightCents = toCents(parseFloat(form.freight_value) || 0);
  const commissionPct = parseFloat(form.commission_percentage) || 0;
  const commissionCents = Math.round(freightCents * (commissionPct / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const tripData = {
      user_id: user.id,
      date: form.date,
      origin: form.origin,
      destination: form.destination,
      cargo_type: form.cargo_type,
      custom_cargo_type: form.cargo_type === "outros" ? form.custom_cargo_type : null,
      freight_value: freightCents,
      commission_percentage: commissionPct,
      commission_value: commissionCents,
      toll_value: toCents(parseFloat(form.toll_value) || 0),
      tax_value: toCents(parseFloat(form.tax_value) || 0),
      scheduling_value: toCents(parseFloat(form.scheduling_value) || 0),
      observations: form.observations || null,
    };

    try {
      if (isEdit && id) {
        const { error } = await supabase.from("trips").update(tripData).eq("id", id);
        if (error) throw error;
        toast.success("Viagem atualizada!");
      } else {
        const { error } = await supabase.from("trips").insert(tripData);
        if (error) throw error;
        toast.success("Viagem registrada!");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar viagem");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";

  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          {isEdit ? "Editar Viagem" : "Nova Viagem"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Data</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Origem</label>
            <input
              type="text"
              placeholder="Cidade de origem"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Destino</label>
            <input
              type="text"
              placeholder="Cidade de destino"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tipo de Carga</label>
          <select
            value={form.cargo_type}
            onChange={(e) => setForm({ ...form, cargo_type: e.target.value as CargoType })}
            className={inputClass}
          >
            {CARGO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {form.cargo_type === "outros" && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Especificar carga</label>
            <input
              type="text"
              placeholder="Tipo de carga"
              value={form.custom_cargo_type}
              onChange={(e) => setForm({ ...form, custom_cargo_type: e.target.value })}
              className={inputClass}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Valor do Frete (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={form.freight_value}
              onChange={(e) => setForm({ ...form, freight_value: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Comissão (%)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0"
              value={form.commission_percentage}
              onChange={(e) => setForm({ ...form, commission_percentage: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <span className="text-xs text-muted-foreground">Valor da Comissão: </span>
          <span className="text-accent font-bold">
            R$ {fromCents(commissionCents).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pedágio (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={form.toll_value}
              onChange={(e) => setForm({ ...form, toll_value: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Imposto (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={form.tax_value}
              onChange={(e) => setForm({ ...form, tax_value: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Agend. (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={form.scheduling_value}
              onChange={(e) => setForm({ ...form, scheduling_value: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
          <textarea
            placeholder="Observações da viagem..."
            value={form.observations}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            className={`${inputClass} h-20 resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : isEdit ? "Atualizar" : "Salvar Viagem"}
        </button>
      </form>
    </div>
  );
}
