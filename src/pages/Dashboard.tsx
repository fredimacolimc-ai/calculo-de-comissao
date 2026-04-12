import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTrips } from "@/hooks/useTrips";
import { formatCurrency } from "@/lib/formatCurrency";
import TripCard from "@/components/TripCard";
import { Plus, TrendingUp, DollarSign, Truck, BarChart3, User } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  isWithinInterval, parseISO, isToday
} from "date-fns";

export default function Dashboard() {
  useAuth();
  const { profile } = useProfile();
  const { trips } = useTrips();
  const navigate = useNavigate();

  const now = new Date();

  const stats = useMemo(() => {
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const monthTrips = trips.filter((t) =>
      isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
    );
    const yearTrips = trips.filter((t) =>
      isWithinInterval(parseISO(t.date), { start: yearStart, end: yearEnd })
    );
    const todayTrips = trips.filter((t) => isToday(parseISO(t.date)));

    const sumCommission = (arr: typeof trips) => arr.reduce((s, t) => s + t.commission_value, 0);
    const sumFreight = (arr: typeof trips) => arr.reduce((s, t) => s + t.freight_value, 0);
    const sumNet = (arr: typeof trips) =>
      arr.reduce((s, t) => s + (t.freight_value - t.toll_value - t.tax_value - t.commission_value), 0);

    return {
      monthCommission: sumCommission(monthTrips),
      monthFreight: sumFreight(monthTrips),
      monthTripsCount: monthTrips.length,
      receivable: sumNet(monthTrips),
      todayNet: sumNet(todayTrips),
      todayCount: todayTrips.length,
      yearNet: sumNet(yearTrips),
      yearCount: yearTrips.length,
    };
  }, [trips]);

  const recentTrips = trips.slice(0, 6);

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-8 rounded-b-3xl"
        style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <User className="text-white/80" size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate-none">
              Olá, {profile?.name || "Motorista"}!
            </h1>
            <p className="text-white/70 text-sm">Controle de Viagens</p>
          </div>
          <button
            onClick={() => navigate("/nova")}
            className="flex items-center gap-1 px-4 py-2 bg-white/15 backdrop-blur border border-white/25 rounded-xl text-white text-sm font-medium shrink-0"
          >
            <Plus size={18} /> Nova Viagem
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Commission & Freight cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-commission rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <p className="text-sm opacity-90">Comissão do Mês</p>
              <TrendingUp size={20} className="opacity-70" />
            </div>
            <p className="text-xl font-bold mt-2">{formatCurrency(stats.monthCommission)}</p>
            <p className="text-xs opacity-70 mt-1">{stats.monthTripsCount} viagens</p>
          </div>
          <div className="bg-freight rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <p className="text-sm opacity-90">Frete do Mês</p>
              <DollarSign size={20} className="opacity-70" />
            </div>
            <p className="text-xl font-bold mt-2">{formatCurrency(stats.monthFreight)}</p>
          </div>
        </div>

        {/* Receivable */}
        <div className="bg-receivable rounded-2xl p-4 flex items-center gap-3">
          <Truck size={24} className="text-white" />
          <span className="text-white font-semibold">Valor a Receber</span>
          <span className="ml-auto text-white font-bold text-lg">{formatCurrency(stats.receivable)}</span>
        </div>

        {/* Period summary */}
        <h2 className="text-lg font-bold text-gray-800 mt-2">Resumo por Período</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500">Hoje</p>
              <Truck size={18} className="text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(stats.todayNet)}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.todayCount} viagem(ns)</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500">Este Ano</p>
              <BarChart3 size={18} className="text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(stats.yearNet)}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.yearCount} viagem(ns)</p>
          </div>
        </div>

        {/* Recent trips */}
        {recentTrips.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mt-2">Viagens Recentes</h2>
            <div className="space-y-3">
              {recentTrips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
