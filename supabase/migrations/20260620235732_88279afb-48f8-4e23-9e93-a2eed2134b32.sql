ALTER TABLE public.job_vacancies REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_vacancies;