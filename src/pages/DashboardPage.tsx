import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Truck, DollarSign, BarChart3 } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalFreight: 0,
    totalCommission: 0,
    totalTolls: 0,
  });
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    if (!user) return;
    const start = startOfMonth(new Date(month + "-01"));
    const end = endOfMonth(start);

    supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .then(({ data }) => {
        const trips = data || [];
        setStats({
          totalTrips: trips.length,
          totalFreight: trips.reduce((sum, t) => sum + t.freight_value, 0),
          totalCommission: trips.reduce((sum, t) => sum + t.commission_value, 0),
          totalTolls: trips.reduce((sum, t) => sum + t.toll_value, 0),
        });
      });
  }, [user, month]);

  const cards = [
    { icon: Truck, label: "Viagens", value: stats.totalTrips.toString(), color: "text-primary" },
    { icon: DollarSign, label: "Frete Total", value: formatCurrency(stats.totalFreight), color: "text-green-400" },
    { icon: TrendingUp, label: "Comissões", value: formatCurrency(stats.totalCommission), color: "text-accent" },
    { icon: BarChart3, label: "Pedágios", value: formatCurrency(stats.totalTolls), color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-4">Dashboard</h1>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl p-4 border border-border space-y-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-lg font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
