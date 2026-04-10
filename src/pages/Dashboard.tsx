import { useMemo } from 'react';
import { TrendingUp, Truck, DollarSign, MapPin } from 'lucide-react';
import type { Trip } from '@/types';

function fmt(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard({ trips }: { trips: Trip[] }) {
  const stats = useMemo(() => {
    const totalFreight = trips.reduce((s, t) => s + t.freight_value, 0);
    const totalCommission = trips.reduce((s, t) => s + t.commission_value, 0);
    const totalToll = trips.reduce((s, t) => s + t.toll_value, 0);
    const totalTax = trips.reduce((s, t) => s + t.tax_value, 0);
    const totalScheduling = trips.reduce((s, t) => s + t.scheduling_value, 0);
    const netValue = totalFreight - totalCommission - totalToll - totalTax - totalScheduling;
    return { totalFreight, totalCommission, totalToll, totalTax, totalScheduling, netValue, count: trips.length };
  }, [trips]);

  return (
    <div className="page">
      <h1 className="page-title">Minhas Viagens</h1>
      <p className="page-subtitle">Resumo geral</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Truck size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Viagens</span>
            <span className="stat-value">{stats.count}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Frete Total</span>
            <span className="stat-value">{fmt(stats.totalFreight)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Líquido</span>
            <span className="stat-value highlight">{fmt(stats.netValue)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><MapPin size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Comissões</span>
            <span className="stat-value">{fmt(stats.totalCommission)}</span>
          </div>
        </div>
      </div>

      {trips.length === 0 && (
        <div className="empty-state">
          <Truck size={48} />
          <p>Nenhuma viagem registrada ainda.</p>
          <p className="empty-hint">Toque em "Nova" para adicionar sua primeira viagem.</p>
        </div>
      )}
    </div>
  );
}
