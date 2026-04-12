import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, refetch } = useProfile();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");
  const [commission, setCommission] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPlate(profile.vehicle_plate || "");
      setCommission(profile.default_commission || 0);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const data = { name, vehicle_plate: plate.toUpperCase(), default_commission: commission };

    if (profile) {
      await supabase.from("profiles").update(data).eq("user_id", user.id);
    } else {
      await supabase.from("profiles").insert({ ...data, user_id: user.id });
    }
    await refetch();
    setSaving(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 outline-none focus:border-brand";

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}>
        <button onClick={() => navigate("/")} className="text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold text-white">Configurações</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Placa do Veículo</label>
          <input value={plate} onChange={(e) => setPlate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Comissão Padrão (%)</label>
          <input type="number" step="0.1" value={commission || ""} onChange={(e) => setCommission(+e.target.value)} className={inputClass} />
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-brand text-white font-semibold disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button onClick={signOut} className="w-full py-3 rounded-xl border border-red-300 text-red-500 font-semibold flex items-center justify-center gap-2">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );
}
