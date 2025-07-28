-- Criar bucket para logos dos relatórios
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-logos', 'report-logos', true);

-- Criar políticas para o bucket de logos
CREATE POLICY "Logos são acessíveis publicamente" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'report-logos');

CREATE POLICY "Usuários autenticados podem fazer upload de logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'report-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar suas logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'report-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar suas logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'report-logos' AND auth.role() = 'authenticated');