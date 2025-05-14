
-- Add alzheimer field to anamnesis table
alter table anamnesis add column if not exists alzheimer boolean default false;
