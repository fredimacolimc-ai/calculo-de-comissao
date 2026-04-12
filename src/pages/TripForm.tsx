import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type CargoType = Database["public"]["Enums"]["cargo_type"];

const cargoOptions: { value: CargoType; label: string }[] = [
  { value: "milho", label: "Milho" },
  { value: "sorgo", label: "Sorgo" },
  { value: "soja", label: "Soja" },
  { value: "farelo_soja", label: "Farelo de Soja" },
  { value: "outros", label: "Outros" },
];

export default function TripForm() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    origin: "",
    destination: "",
    freight_value: 0,
    toll_value: 0,
    tax_value: 0,
    scheduling_value: 0,
    commission_percentage: 0,
    cargo_type: "milho" as CargoType,
    custom_cargo_type: "",
    observations: "",
  });

  useEffect(() => {
    if (profile) {
      setForm((f) => ({ ...f, commission_percentage: profile.default_commission }));
    }
  }, [profile]);

  const netFreight = form.freight_value - form.toll_value - form.tax_value;
  const commissionValue = netFreight * (form.commission_percentage / 100);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    await supabase.from("trips").insert({
      user_id: user.id,
      date: form.date,
      origin: form.origin,
      destination: form.destination,
      freight_value: form.freight_value,
      toll_value: form.toll_value,
      tax_value: form.tax_value,
      scheduling_value: form.scheduling_value,
      commission_percentage: form.commission_percentage,
      commission_value: commissionValue,
      cargo_type: form.cargo_type,
      custom_cargo_type: form.cargo_type === "outros" ? form.custom_cargo_type : null,
      observations: form.observations || null,
    });

    navigate("/");
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand/30";

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}>
        <button onClick={() => navigate(-1)} className="text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold text-white">Nova Viagem</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 mt-4 space-y-4">
        <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputClass} required />
        <input placeholder="Origem" value={form.origin} onChange={(e) => set("origin", e.target.value)} className={inputClass} required />
        <input placeholder="Destino" value={form.destination} onChange={(e) => set("destination", e.target.value)} className={inputClass} required />

        <select value={form.cargo_type} onChange={(e) => set("cargo_type", e.target.value)} className={inputClass}>
          {cargoOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {form.cargo_type === "outros" && (
          <input placeholder="Tipo de carga" value={form.custom_cargo_type} onChange={(e) => set("custom_cargo_type", e.target.value)} className={inputClass} />
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Frete (R$)</label>
            <input type="number" step="0.01" value={form.freight_value || ""} onChange={(e) => set("freight_value", +e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Pedágio (R$)</label>
            <input type="number" step="0.01" value={form.toll_value || ""} onChange={(e) => set("toll_value", +e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Imposto (R$)</label>
            <input type="number" step="0.01" value={form.tax_value || ""} onChange={(e) => set("tax_value", +e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Marcação (R$)</label>
            <input type="number" step="0.01" value={form.scheduling_value || ""} onChange={(e) => set("scheduling_value", +e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Comissão (%)</label>
          <input type="number" step="0.1" value={form.commission_percentage || ""} onChange={(e) => set("commission_percentage", +e.target.value)} className={inputClass} />
          <p className="text-sm text-blue-600 mt-1">Valor: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(commissionValue)}</p>
        </div>

        <textarea placeholder="Observações" value={form.observations} onChange={(e) => set("observations", e.target.value)} className={inputClass + " h-20 resize-none"} />

        <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar Viagem"}
        </button>
      </form>
    </div>
  );
}
