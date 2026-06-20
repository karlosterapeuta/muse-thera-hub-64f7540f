import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface JobVacancy {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  source: string | null;
  description: string | null;
  posted_at: string | null;
  status: string;
  relevance_score: number | null;
  created_at: string;
}

const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

export type Modalidade = "Remoto" | "Híbrido" | "Presencial";
export type Contrato = "CLT" | "PJ" | "Autônomo" | "Estágio" | "Concurso";

export interface EnrichedVacancy extends JobVacancy {
  uf: string | null;
  city: string | null;
  modalidade: Modalidade | null;
  contrato: Contrato | null;
  area: string | null;
  isNew: boolean;
  isUrgent: boolean;
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function detectUf(text: string): string | null {
  const upper = text.toUpperCase();
  for (const uf of UF_LIST) {
    if (new RegExp(`(^|[^A-Z])${uf}([^A-Z]|$)`).test(upper)) return uf;
  }
  return null;
}

function detectModalidade(text: string): Modalidade | null {
  const t = norm(text);
  if (/\bhibrid/.test(t)) return "Híbrido";
  if (/\b(remot|home office|teletrabalho|a distancia)/.test(t)) return "Remoto";
  if (/\bpresencial\b/.test(t)) return "Presencial";
  return null;
}

function detectContrato(text: string): Contrato | null {
  const t = norm(text);
  if (/\bconcurso\b|edital|estatutario/.test(t)) return "Concurso";
  if (/\bestagi/.test(t)) return "Estágio";
  if (/\bclt\b|carteira assinada|efetivo/.test(t)) return "CLT";
  if (/\bpj\b|pessoa juridica/.test(t)) return "PJ";
  if (/\bautonom|freelanc/.test(t)) return "Autônomo";
  return null;
}

function detectArea(text: string): string | null {
  const t = norm(text);
  if (/\btea\b|autis|aba\b/.test(t)) return "TEA";
  if (/hospital/.test(t)) return "Hospitalar";
  if (/escol|educac/.test(t)) return "Escolar";
  if (/clinic/.test(t)) return "Clínica";
  if (/reabilitac|neurodesenvolv/.test(t)) return "Reabilitação";
  if (/saude mental|mental/.test(t)) return "Saúde Mental";
  return null;
}

function enrich(v: JobVacancy): EnrichedVacancy {
  const blob = `${v.title} ${v.company ?? ""} ${v.location ?? ""} ${v.description ?? ""}`;
  const uf = v.location ? detectUf(v.location) : detectUf(blob);
  let city: string | null = null;
  if (v.location) {
    city = v.location.split(/[,\-–]/)[0]?.trim() || null;
    if (city && UF_LIST.includes(city.toUpperCase())) city = null;
  }
  const ageMs = Date.now() - new Date(v.created_at).getTime();
  const isNew = ageMs < 1000 * 60 * 60 * 72; // 72h
  const isUrgent =
    (v.relevance_score ?? 0) >= 85 || /\burgente\b/i.test(blob);

  return {
    ...v,
    uf,
    city,
    modalidade: detectModalidade(blob),
    contrato: detectContrato(blob),
    area: detectArea(blob),
    isNew,
    isUrgent,
  };
}

export function useJobVacancies() {
  const [vacancies, setVacancies] = useState<EnrichedVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_vacancies")
      .select(
        "id,title,company,location,url,source,description,posted_at,status,relevance_score,created_at"
      )
      .in("status", ["approved", "sent"])
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      setError(error.message);
      setVacancies([]);
    } else {
      setError(null);
      setVacancies((data as JobVacancy[]).map(enrich));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel("job_vacancies_changes")
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

  const newCount = useMemo(
    () => vacancies.filter((v) => v.isNew).length,
    [vacancies]
  );

  return { vacancies, loading, error, newCount, reload: load };
}
