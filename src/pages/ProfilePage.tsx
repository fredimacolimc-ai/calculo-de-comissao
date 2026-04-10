import { useState } from 'react';
import { Save, User } from 'lucide-react';
import type { Profile } from '@/types';

interface Props {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

export default function ProfilePage({ profile, onUpdate }: Props) {
  const [name, setName] = useState(profile.name);
  const [plate, setPlate] = useState(profile.vehicle_plate);
  const [commission, setCommission] = useState(String(profile.default_commission));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      name: name.trim(),
      vehicle_plate: plate.trim().toUpperCase(),
      default_commission: parseFloat(commission) || 7,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="profile-avatar">
        <User size={40} />
      </div>
      <h1 className="page-title">Perfil</h1>

      <div className="form-group">
        <label>Nome do Motorista</label>
        <input type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Placa do Veículo</label>
        <input type="text" placeholder="ABC-1234" value={plate} onChange={e => setPlate(e.target.value)} maxLength={8} />
      </div>

      <div className="form-group">
        <label>Comissão Padrão (%)</label>
        <input type="text" inputMode="decimal" value={commission} onChange={e => setCommission(e.target.value)} />
      </div>

      <button className="btn-primary" onClick={handleSave}>
        <Save size={18} /> {saved ? 'Salvo!' : 'Salvar Perfil'}
      </button>
    </div>
  );
}
