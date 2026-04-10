import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import type { Trip, CargoType, Profile } from '@/types';
import { CARGO_LABELS } from '@/types';

interface Props {
  profile: Profile;
  onAdd: (trip: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => void;
}

function parseCents(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  return Math.round((parseFloat(cleaned) || 0) * 100);
}

export default function NewTrip({ profile, onAdd }: Props) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('soja');
  const [customCargo, setCustomCargo] = useState('');
  const [freightStr, setFreightStr] = useState('');
  const [tollStr, setTollStr] = useState('');
  const [taxStr, setTaxStr] = useState('');
  const [schedulingStr, setSchedulingStr] = useState('');
  const [commPct, setCommPct] = useState(String(profile.default_commission));
  const [observations, setObservations] = useState('');

  const freightCents = parseCents(freightStr);
  const commissionValue = Math.round(freightCents * (parseFloat(commPct) || 0) / 100);

  const canSave = origin.trim() && destination.trim() && date;

  const handleSave = () => {
    if (!canSave) return;
    onAdd({
      date,
      origin: origin.trim(),
      destination: destination.trim(),
      cargo_type: cargoType,
      custom_cargo_type: cargoType === 'outros' ? customCargo.trim() : undefined,
      freight_value: freightCents,
      toll_value: parseCents(tollStr),
      tax_value: parseCents(taxStr),
      scheduling_value: parseCents(schedulingStr),
      commission_percentage: parseFloat(commPct) || 0,
      commission_value: commissionValue,
      observations: observations.trim() || undefined,
    });
    navigate('/viagens');
  };

  return (
    <div className="page">
      <h1 className="page-title">Nova Viagem</h1>

      <div className="form-group">
        <label>Data</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Origem</label>
          <input type="text" placeholder="Cidade de origem" value={origin} onChange={e => setOrigin(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Destino</label>
          <input type="text" placeholder="Cidade de destino" value={destination} onChange={e => setDestination(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Tipo de Carga</label>
        <select value={cargoType} onChange={e => setCargoType(e.target.value as CargoType)}>
          {Object.entries(CARGO_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {cargoType === 'outros' && (
        <div className="form-group">
          <label>Especificar carga</label>
          <input type="text" placeholder="Tipo de carga" value={customCargo} onChange={e => setCustomCargo(e.target.value)} />
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Frete (R$)</label>
          <input type="text" inputMode="decimal" placeholder="0,00" value={freightStr} onChange={e => setFreightStr(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Pedágio (R$)</label>
          <input type="text" inputMode="decimal" placeholder="0,00" value={tollStr} onChange={e => setTollStr(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Impostos (R$)</label>
          <input type="text" inputMode="decimal" placeholder="0,00" value={taxStr} onChange={e => setTaxStr(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Agendamento (R$)</label>
          <input type="text" inputMode="decimal" placeholder="0,00" value={schedulingStr} onChange={e => setSchedulingStr(e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Comissão (%)</label>
        <input type="text" inputMode="decimal" value={commPct} onChange={e => setCommPct(e.target.value)} />
        {freightCents > 0 && (
          <span className="field-hint">
            Valor: {(commissionValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>Observações</label>
        <textarea placeholder="Observações opcionais..." value={observations} onChange={e => setObservations(e.target.value)} rows={3} />
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={!canSave}>
        <Save size={18} /> Salvar Viagem
      </button>
    </div>
  );
}
