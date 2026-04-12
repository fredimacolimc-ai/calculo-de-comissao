import { useTrips } from "@/hooks/useTrips";
import { formatCurrency } from "@/lib/formatCurrency";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";

export default function Reports() {
  const { trips } = useTrips();
  const navigate = useNavigate();
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));

  const filtered = useMemo(() => {
    return trips.filter((t) => t.date.startsWith(month));
  }, [trips, month]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, t) => ({
        freight: acc.freight + t.freight_value,
        toll: acc.toll + t.toll_value,
        tax: acc.tax + t.tax_value,
        commission: acc.commission + t.commission_value,
        net: acc.net + (t.freight_value - t.toll_value - t.tax_value - t.commission_value),
      }),
      { freight: 0, toll: 0, tax: 0, commission: 0, net: 0 }
    );
  }, [filtered]);

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}>
        <button onClick={() => navigate("/")} className="text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold text-white">Relatórios</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white" />

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
          <h3 className="font-bold text-gray-800">Resumo - {filtered.length} viagens</h3>
          <div className="flex justify-between"><span className="text-gray-500">Frete Total</span><span className="font-semibold">{formatCurrency(totals.freight)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Pedágios</span><span className="text-red-500">{formatCurrency(totals.toll)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Impostos</span><span className="text-red-500">{formatCurrency(totals.tax)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Comissões</span><span className="text-blue-600">{formatCurrency(totals.commission)}</span></div>
          <hr />
          <div className="flex justify-between"><span className="font-bold text-gray-800">Líquido</span><span className="font-bold text-green-600">{formatCurrency(totals.net)}</span></div>
        </div>
      </div>
    </div>
  );
}
