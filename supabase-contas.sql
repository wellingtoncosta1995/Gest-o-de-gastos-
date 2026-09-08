-- Rode este script no Supabase: Dashboard > SQL Editor > New query > Run
-- Cria a tabela de contas bancárias, usada para calcular o patrimônio líquido.

create table if not exists public.contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  instituicao text not null,
  tipo text not null default 'corrente' check (tipo in ('corrente','poupanca','investimento','carteira_digital')),
  saldo_atual numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.contas enable row level security;

create policy "usuarios_gerenciam_suas_contas"
  on public.contas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
