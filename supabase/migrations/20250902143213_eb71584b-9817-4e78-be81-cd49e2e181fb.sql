-- Change session_date from timestamptz to date to avoid timezone shifts
ALTER TABLE public.financial_records
ALTER COLUMN session_date TYPE date USING (session_date::date);
