-- Rode este script no Supabase: Dashboard > SQL Editor > New query > Run
-- Cria as tabelas de cartões de crédito e compras, seguindo o mesmo padrão
-- de segurança (RLS por usuário) já usado nas tabelas gastos/dividas/metas.

create table if not exists public.cartoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  banco text,
  limite numeric not null,
  created_at timestamptz not null default now()
);

alter table public.cartoes enable row level security;

create policy "usuarios_gerenciam_seus_cartoes"
  on public.cartoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.compras_cartao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cartao_id uuid not null references public.cartoes(id) on delete cascade,
  nome text not null,
  valor numeric not null,
  parcelas integer not null default 1,
  atual integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.compras_cartao enable row level security;

create policy "usuarios_gerenciam_suas_compras"
  on public.compras_cartao for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
