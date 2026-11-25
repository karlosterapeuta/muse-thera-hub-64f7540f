alter table public.plan_renewals
  add column if not exists mp_payment_id text,
  add column if not exists mp_payment_status text;

create index if not exists plan_renewals_user_created_idx
  on public.plan_renewals (user_id, created_at desc);

create unique index if not exists plan_renewals_mp_payment_id_uidx
  on public.plan_renewals (mp_payment_id)
  where mp_payment_id is not null;

comment on column public.plan_renewals.mp_payment_id is
  'Mercado Pago payment identifier; populated by the server-side Payment Brick flow.';
