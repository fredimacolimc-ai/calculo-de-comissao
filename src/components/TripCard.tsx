import { forwardRef } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Trip } from "@/hooks/useTrips";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const cargoLabels: Record<string, string> = {
  milho: "Milho",
  sorgo: "Sorgo",
  soja: "Soja",
  farelo_soja: "Farelo de Soja",
  outros: "Outros",
};

interface Props {
  trip: Trip;
  onClick?: () => void;
}

const TripCard = forwardRef<HTMLDivElement, Props>(({ trip, onClick }, ref) => {
  const netFreight = trip.freight_value - trip.toll_value - trip.tax_value;
  
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">
            {trip.origin} → {trip.destination}
          </p>
          <p className="text-sm text-gray-500">
            {format(parseISO(trip.date), "dd/MM/yyyy", { locale: ptBR })} •{" "}
            {cargoLabels[trip.cargo_type] || trip.custom_cargo_type || trip.cargo_type}
          </p>
        </div>
        <span className="text-brand font-bold">{formatCurrency(netFreight)}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-base">
        <span className="text-gray-600">Frete: {formatCurrency(trip.freight_value)}</span>
        <span className="text-red-500">Pedágio: {formatCurrency(trip.toll_value)}</span>
        <span className="text-yellow-600">Marc.: {formatCurrency(trip.scheduling_value)}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-base mt-1">
        <span className="text-red-500">Imposto: {formatCurrency(trip.tax_value)}</span>
        <span className="text-blue-600">Comissão: {formatCurrency(trip.commission_value)}</span>
      </div>
    </div>
  );
});

TripCard.displayName = "TripCard";
export default TripCard;
