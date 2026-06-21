import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Counts recently published vacancies (last 72h) for the sidebar badge. */
export function useNewVacanciesCount() {
  const [count, setCount] = useState(0);

  const load = async () => {
    const since = new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString();
    const { count: c } = await supabase
      .from("job_vacancies")
      .select("id", { count: "exact", head: true })
      .in("status", ["approved", "sent"])
      .gte("created_at", since);
    setCount(c ?? 0);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`job_vacancies_count_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_vacancies" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
