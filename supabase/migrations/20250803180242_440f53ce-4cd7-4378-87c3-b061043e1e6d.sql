-- Verificar se existe foreign key entre anamnesis e patients
-- Se não existir, vamos criar
DO $$
BEGIN
    -- Verificar se a foreign key já existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'anamnesis' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%patient%'
    ) THEN
        -- Adicionar foreign key se não existir
        ALTER TABLE public.anamnesis 
        ADD CONSTRAINT fk_anamnesis_patient 
        FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key criada entre anamnesis e patients';
    ELSE
        RAISE NOTICE 'Foreign key já existe entre anamnesis e patients';
    END IF;
END $$;