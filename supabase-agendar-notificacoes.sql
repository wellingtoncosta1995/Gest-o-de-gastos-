-- ############################################################
-- # NÃO EDITE ESTE ARQUIVO NO GITHUB. NÃO SALVE/COMMIT COM A  #
-- # CHAVE REAL AQUI DENTRO. Baixe/copie o texto e cole DIRETO #
-- # no SQL Editor do Supabase (supabase.com/dashboard) — a    #
-- # troca da chave só deve acontecer lá, nunca neste arquivo. #
-- ############################################################
--
-- Rode isso DEPOIS de:
--   1) Habilitar as extensões "pg_cron" e "pg_net" em Database > Extensions
--   2) Publicar a Edge Function "checar-assinaturas" (supabase-edge-function-notificacoes.ts)
--   3) Configurar os segredos da função (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, SUPABASE_SERVICE_ROLE_KEY)
--
-- No SQL Editor do Supabase (não aqui), troque <SERVICE_ROLE_KEY>
-- pela chave em Settings > API > service_role antes de rodar.

select cron.schedule(
  'checar-assinaturas-vencendo',
  '0 12 * * *', -- todo dia às 12:00 UTC (09:00 no horário de Brasília)
  $$
  select net.http_post(
    url := 'https://lcuaphodobwotxplcskn.supabase.co/functions/v1/dynamic-action',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
