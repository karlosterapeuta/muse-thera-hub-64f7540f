import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type ReportPatient = {
  id: string;
  name: string;
  birth_date?: string | null;
  age?: number | null;
  responsible?: string | null;
};
type ProfessionalContact = { name: string; phone: string; email: string };
const EMPTY_PROFESSIONAL: ProfessionalContact = { name: "", phone: "", email: "" };

export function useReportData() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<ReportPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [patientsLoadError, setPatientsLoadError] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [professionalData, setProfessionalData] = useState<ProfessionalContact>(EMPTY_PROFESSIONAL);

  useEffect(() => {
    let disposed = false;
    let generation = 0;
    let currentAccount: string | null = null;
    const reset = () => {
      setPatients([]);
      setUserEmail("");
      setUserName("");
      setUserId(null);
      setProfessionalData(EMPTY_PROFESSIONAL);
      setPatientsLoadError(false);
    };
    const load = async (sessionId: string | null) => {
      const request = ++generation;
      if (sessionId !== currentAccount) {
        currentAccount = sessionId;
        reset(); // Never show the previous account's patients during a session switch.
      }
      if (!sessionId) {
        setIsLoadingPatients(false);
        return;
      }
      setIsLoadingPatients(true);
      setPatientsLoadError(false);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user || user.id !== sessionId) throw new Error("Sessão não confirmada");
        const [patientResult, professionalResult] = await Promise.all([
          supabase.from("patients")
            .select("id, name, birth_date, age, responsible")
            .eq("professional_id", user.id)
            .order("name"),
          supabase.from("professionals")
            .select("name, phone, email")
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);
        if (patientResult.error) throw patientResult.error;
        if (professionalResult.error) throw professionalResult.error;
        if (disposed || request !== generation) return;
        setUserId(user.id);
        setUserEmail(user.email || "");
        setUserName((user.email || "").split("@")[0].replace(/[._-]/g, " "));
        setPatients(patientResult.data || []);
        setProfessionalData({
          name: professionalResult.data?.name || "",
          phone: professionalResult.data?.phone || "",
          email: professionalResult.data?.email || "",
        });
      } catch {
        if (disposed || request !== generation) return;
        reset();
        setPatientsLoadError(true);
        toast({
          variant: "destructive", title: "Erro ao carregar dados",
          description: "Não foi possível carregar os pacientes e o perfil profissional. Tente novamente.",
        });
      } finally {
        if (!disposed && request === generation) setIsLoadingPatients(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Schedule outside the auth callback to avoid awaiting Supabase calls in it.
      queueMicrotask(() => { if (!disposed) void load(session?.user?.id ?? null); });
    });
    void supabase.auth.getSession().then(({ data }) => {
      // INITIAL_SESSION may run first: reloading a stable account is harmless.
      if (!disposed && generation === 0) void load(data.session?.user?.id ?? null);
    }).catch(() => { if (!disposed && generation === 0) { reset(); setIsLoadingPatients(false); } });
    return () => { disposed = true; generation++; subscription.unsubscribe(); };
  }, [toast]);

  return { patients, isLoadingPatients, patientsLoadError, userEmail, userName, userId, professionalData };
}
