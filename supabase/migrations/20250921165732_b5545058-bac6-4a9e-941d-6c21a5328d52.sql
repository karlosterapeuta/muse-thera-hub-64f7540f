-- Add recurrence fields to financial_records table
ALTER TABLE public.financial_records 
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN recurrence_type text CHECK (recurrence_type IN ('weekly', 'monthly', 'yearly')),
ADD COLUMN recurrence_end_date date,
ADD COLUMN parent_record_id uuid REFERENCES public.financial_records(id) ON DELETE CASCADE,
ADD COLUMN recurrence_pattern jsonb DEFAULT '{}';

-- Create index for better performance on recurring record queries
CREATE INDEX idx_financial_records_recurring ON public.financial_records(is_recurring, parent_record_id);
CREATE INDEX idx_financial_records_recurrence_type ON public.financial_records(recurrence_type);

-- Add comment to table
COMMENT ON TABLE public.financial_records IS 'Financial records with support for recurring entries';
COMMENT ON COLUMN public.financial_records.is_recurring IS 'Indicates if this is a recurring financial record';
COMMENT ON COLUMN public.financial_records.recurrence_type IS 'Type of recurrence: weekly, monthly, yearly';
COMMENT ON COLUMN public.financial_records.recurrence_end_date IS 'End date for recurring records generation';
COMMENT ON COLUMN public.financial_records.parent_record_id IS 'Reference to the original record that spawned this recurring entry';
COMMENT ON COLUMN public.financial_records.recurrence_pattern IS 'JSON object containing detailed recurrence pattern (days of week, etc.)';

-- Function to generate recurring financial records
CREATE OR REPLACE FUNCTION generate_recurring_financial_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec_record financial_records%ROWTYPE;
  next_date date;
  current_date_var date := CURRENT_DATE;
BEGIN
  -- Process all active recurring records
  FOR rec_record IN 
    SELECT * FROM financial_records 
    WHERE is_recurring = true 
    AND parent_record_id IS NULL 
    AND (recurrence_end_date IS NULL OR recurrence_end_date >= current_date_var)
  LOOP
    -- Calculate next occurrence date based on recurrence type
    CASE rec_record.recurrence_type
      WHEN 'weekly' THEN
        next_date := rec_record.session_date + INTERVAL '7 days';
      WHEN 'monthly' THEN
        next_date := rec_record.session_date + INTERVAL '1 month';
      WHEN 'yearly' THEN
        next_date := rec_record.session_date + INTERVAL '1 year';
    END CASE;
    
    -- Generate records until end date or 3 months ahead (whichever is sooner)
    WHILE next_date <= COALESCE(rec_record.recurrence_end_date, current_date_var + INTERVAL '3 months')
    AND next_date <= current_date_var + INTERVAL '3 months'
    LOOP
      -- Check if record doesn't already exist
      IF NOT EXISTS (
        SELECT 1 FROM financial_records 
        WHERE parent_record_id = rec_record.id 
        AND session_date = next_date
      ) THEN
        -- Create new recurring record
        INSERT INTO financial_records (
          professional_id,
          clinic_id,
          patient_id,
          amount,
          session_date,
          description,
          is_recurring,
          recurrence_type,
          recurrence_end_date,
          parent_record_id,
          recurrence_pattern
        ) VALUES (
          rec_record.professional_id,
          rec_record.clinic_id,
          rec_record.patient_id,
          rec_record.amount,
          next_date,
          rec_record.description || ' (Recorrente)',
          false, -- Child records are not recurring themselves
          NULL,
          NULL,
          rec_record.id,
          rec_record.recurrence_pattern
        );
      END IF;
      
      -- Calculate next occurrence
      CASE rec_record.recurrence_type
        WHEN 'weekly' THEN
          next_date := next_date + INTERVAL '7 days';
        WHEN 'monthly' THEN
          next_date := next_date + INTERVAL '1 month';
        WHEN 'yearly' THEN
          next_date := next_date + INTERVAL '1 year';
      END CASE;
    END LOOP;
  END LOOP;
END;
$$;