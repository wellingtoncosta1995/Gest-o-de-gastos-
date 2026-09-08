-- Migração 3: distingue entrada (receita) de saída (gasto) nos lançamentos.
-- Sem isso, um salário lançado entrava somado no gráfico de categorias e no
-- "gasto do mês" como se fosse uma despesa.

alter table public.gastos add column if not exists tipo text not null default 'saida' check (tipo in ('entrada','saida'));
