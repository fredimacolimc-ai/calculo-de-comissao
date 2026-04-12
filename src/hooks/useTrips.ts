import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Trip {
  id: string;
  user_id: string;
  date: string;
  origin: string;
  destination: string;
  freight_value: number;
  toll_value: number;
  tax_value: number;
  scheduling_value: number;
  commission_percentage: number;
  commission_value: number;
  cargo_type: string;
  custom_cargo_type: string | null;
  observations: string | null;
  receipt_photo: string | null;
  cte_file: string | null;
  cte_file_name: string | null;
  created_at: string;
}

export function useTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setTrips((data as Trip[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  return { trips, loading, refetch: fetch };
}
