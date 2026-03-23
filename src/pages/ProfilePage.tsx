import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogOut, Save, User } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [defaultCommission, setDefaultCommission] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setName(data.name || "");
          setVehiclePlate(data.vehicle_plate || "");
          setDefaultCommission(data.default_commission?.toString() || "");
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        name,
        vehicle_plate: vehiclePlate,
        default_commission: parseFloat(defaultCommission) || 0,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) {
      toast.error("Erro ao salvar perfil");
    } else {
      toast.success("Perfil salvo!");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full px-3 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-6">Perfil</h1>

      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Motorista</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Placa do Veículo</label>
          <input
            type="text"
            placeholder="ABC-1234"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Comissão Padrão (%)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0"
            value={defaultCommission}
            onChange={(e) => setDefaultCommission(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Perfil"}
        </button>

        <button
          onClick={signOut}
          className="w-full py-3 rounded-lg bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2 hover:bg-destructive/20 transition mt-6"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
