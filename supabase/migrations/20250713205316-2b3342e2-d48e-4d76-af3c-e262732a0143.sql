-- Adicionar colunas para história sonora e musical detalhada na tabela anamnesis
ALTER TABLE public.anamnesis ADD COLUMN pregnancy_sound_experiences TEXT;
ALTER TABLE public.anamnesis ADD COLUMN mother_movements_songs TEXT;
ALTER TABLE public.anamnesis ADD COLUMN childhood_sound_environment TEXT;
ALTER TABLE public.anamnesis ADD COLUMN parents_sound_reactions TEXT;
ALTER TABLE public.anamnesis ADD COLUMN typical_house_sounds TEXT;
ALTER TABLE public.anamnesis ADD COLUMN night_body_sounds TEXT;
ALTER TABLE public.anamnesis ADD COLUMN family_musical_history TEXT;
ALTER TABLE public.anamnesis ADD COLUMN patient_musical_history TEXT;