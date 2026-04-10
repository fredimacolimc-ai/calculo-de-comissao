import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Trip } from '@/types';
import { CARGO_LABELS } from '@/types';

function fmt(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default function Trips({ trips, onDelete }: { trips: Trip[]; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (trips.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Viagens</h1>
        <div className="empty-state">
          <p>Nenhuma viagem registrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Viagens</h1>
      <p className="page-subtitle">{trips.length} viagen{trips.length !== 1 ? 's' : ''}</p>

      <div className="trip-list">
        {trips.map(trip => {
          const isOpen = expanded === trip.id;
          return (
            <div key={trip.id} className="trip-card">
              <button className="trip-header" onClick={() => setExpanded(isOpen ? null : trip.id)}>
                <div className="trip-route">
                  <span className="trip-date">{fmtDate(trip.date)}</span>
                  <span className="trip-cities">{trip.origin} → {trip.destination}</span>
                </div>
                <div className="trip-freight">{fmt(trip.freight_value)}</div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isOpen && (
                <div className="trip-details">
                  <div className="detail-row"><span>Carga</span><span>{trip.cargo_type === 'outros' && trip.custom_cargo_type ? trip.custom_cargo_type : CARGO_LABELS[trip.cargo_type]}</span></div>
                  <div className="detail-row"><span>Frete</span><span>{fmt(trip.freight_value)}</span></div>
                  <div className="detail-row"><span>Pedágio</span><span>{fmt(trip.toll_value)}</span></div>
                  <div className="detail-row"><span>Impostos</span><span>{fmt(trip.tax_value)}</span></div>
                  <div className="detail-row"><span>Agendamento</span><span>{fmt(trip.scheduling_value)}</span></div>
                  <div className="detail-row"><span>Comissão ({trip.commission_percentage}%)</span><span>{fmt(trip.commission_value)}</span></div>
                  {trip.observations && <div className="detail-row"><span>Obs</span><span>{trip.observations}</span></div>}
                  <button className="btn-danger" onClick={() => { if (confirm('Excluir esta viagem?')) onDelete(trip.id); }}>
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
