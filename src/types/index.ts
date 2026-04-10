export type CargoType = 'milho' | 'sorgo' | 'soja' | 'farelo_soja' | 'outros';

export const CARGO_LABELS: Record<CargoType, string> = {
  milho: 'Milho',
  sorgo: 'Sorgo',
  soja: 'Soja',
  farelo_soja: 'Farelo de Soja',
  outros: 'Outros',
};

export interface Trip {
  id: string;
  date: string;
  origin: string;
  destination: string;
  cargo_type: CargoType;
  custom_cargo_type?: string;
  freight_value: number;
  toll_value: number;
  tax_value: number;
  scheduling_value: number;
  commission_percentage: number;
  commission_value: number;
  observations?: string;
  receipt_photo?: string;
  cte_file?: string;
  cte_file_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  name: string;
  vehicle_plate: string;
  default_commission: number;
}
