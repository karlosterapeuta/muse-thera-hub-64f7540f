-- Adicionar colunas Asaas na tabela course_creators
ALTER TABLE public.course_creators 
ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
ADD COLUMN IF NOT EXISTS asaas_wallet_id TEXT,
ADD COLUMN IF NOT EXISTS asaas_account_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS cpf_cnpj TEXT;

-- Adicionar colunas Asaas na tabela course_purchases
ALTER TABLE public.course_purchases 
ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT,
ADD COLUMN IF NOT EXISTS asaas_pix_qr_code TEXT,
ADD COLUMN IF NOT EXISTS asaas_pix_copy_paste TEXT;

-- Criar índice para buscar pagamentos pelo ID do Asaas
CREATE INDEX IF NOT EXISTS idx_course_purchases_asaas_payment_id 
ON public.course_purchases(asaas_payment_id);