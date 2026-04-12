import { useTrips } from "@/hooks/useTrips";
import TripCard from "@/components/TripCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TripList() {
  const { trips, loading } = useTrips();
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="px-4 pt-4 pb-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #1e4b73 0%, #0f2b47 100%)" }}>
        <button onClick={() => navigate("/")} className="text-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold text-white">Minhas Viagens</h1>
      </div>
      <div className="px-4 mt-4 space-y-3">
        {loading && <p className="text-gray-500 text-center py-8">Carregando...</p>}
        {!loading && trips.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma viagem registrada.</p>}
        {trips.map((t) => <TripCard key={t.id} trip={t} />)}
      </div>
    </div>
  );
}
