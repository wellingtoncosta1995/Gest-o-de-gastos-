-- Migração 2: fatura de cartão com projeção de parcelas, orçamentos por
-- categoria e assinaturas/recorrências. Rode tudo de uma vez no SQL Editor.

-- 1) Cartões: dia de fechamento e de vencimento da fatura
alter table public.cartoes add column if not exists dia_fechamento smallint check (dia_fechamento between 1 and 31);
alter table public.cartoes add column if not exists dia_vencimento smallint check (dia_vencimento between 1 and 31);

-- 2) Compras do cartão: valor total da compra + data (permite projetar a
--    parcela correta em qualquer mês, passado ou futuro)
alter table public.compras_cartao rename column valor to valor_total;
alter table public.compras_cartao add column if not exists data_compra date not null default current_date;
alter table public.compras_cartao drop column if exists atual;

-- 3) Orçamentos por categoria
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  categoria text not null,
  valor_limite numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, categoria)
);

alter table public.orcamentos enable row level security;

create policy "usuarios_gerenciam_seus_orcamentos"
  on public.orcamentos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4) Assinaturas e recorrências
create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  valor numeric not null,
  ciclo text not null default 'mensal' check (ciclo in ('mensal','anual')),
  dia_cobranca smallint not null default 1 check (dia_cobranca between 1 and 31),
  mes_cobranca smallint check (mes_cobranca between 1 and 12),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.assinaturas enable row level security;

create policy "usuarios_gerenciam_suas_assinaturas"
  on public.assinaturas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
