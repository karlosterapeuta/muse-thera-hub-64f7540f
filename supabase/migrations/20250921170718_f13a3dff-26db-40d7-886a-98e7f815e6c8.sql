-- Add session_status column to financial_records table
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'no_show');

ALTER TABLE public.financial_records 
ADD COLUMN session_status session_status DEFAULT 'scheduled';

-- Create index for better performance on status queries
CREATE INDEX idx_financial_records_session_status ON public.financial_records(session_status);

-- Add comment to the new column
COMMENT ON COLUMN public.financial_records.session_status IS 'Status of the session: scheduled (blue), completed (green), no_show (red)';