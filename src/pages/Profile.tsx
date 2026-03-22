import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", vehicle_plate: "", default_commission: 10 });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({ name: data.name, vehicle_plate: data.vehicle_plate, default_commission: data.default_commission });
      }
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user!.id).maybeSingle();

    const { error } = existing
      ? await supabase.from("profiles").update(form).eq("user_id", user!.id)
      : await supabase.from("profiles").insert({ ...form, user_id: user!.id });

    if (error) {
      toast.error("Erro ao salvar perfil");
    } else {
      toast.success("Perfil salvo");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-md mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Placa do Veículo</Label>
                <Input value={form.vehicle_plate} onChange={(e) => setForm({ ...form, vehicle_plate: e.target.value })} placeholder="ABC-1234" />
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão (%)</Label>
                <Input type="number" step="0.1" value={form.default_commission} onChange={(e) => setForm({ ...form, default_commission: Number(e.target.value) })} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
