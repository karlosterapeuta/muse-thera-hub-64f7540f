drop policy if exists "Patient photos: public read" on storage.objects;
drop policy if exists "Patient photos: authenticated insert" on storage.objects;
drop policy if exists "Patient photos: authenticated update" on storage.objects;
drop policy if exists "Patient photos: authenticated delete" on storage.objects;

create policy "Patient photos: public read"
on storage.objects for select
using (bucket_id = 'patients');

create policy "Patient photos: authenticated insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'patients');

create policy "Patient photos: authenticated update"
on storage.objects for update
to authenticated
using (bucket_id = 'patients')
with check (bucket_id = 'patients');

create policy "Patient photos: authenticated delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'patients');