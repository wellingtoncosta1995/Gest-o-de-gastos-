-- Rode isso DEPOIS de:
--   1) Habilitar as extensões "pg_cron" e "pg_net" em Database > Extensions
--   2) Publicar a Edge Function "checar-assinaturas" (supabase-edge-function-notificacoes.ts)
--   3) Configurar os segredos da função (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, SUPABASE_SERVICE_ROLE_KEY)
--
-- Troque <SERVICE_ROLE_KEY> pela chave em Settings > API > service_role
-- antes de rodar. NUNCA cole essa chave numa conversa com o Claude ou no
-- GitHub — ela dá acesso total ao seu banco. Rode só aqui, direto no SQL Editor.

select cron.schedule(
  'checar-assinaturas-vencendo',
  '0 12 * * *', -- todo dia às 12:00 UTC (09:00 no horário de Brasília)
  $$
  select net.http_post(
    url := 'https://lcuaphodobwotxplcskn.supabase.co/functions/v1/dynamic-action',
    headers := jsonb_build_object(
      'Authorization', 'Bearer sb_secret_wKejNig8Qn922KOCUDTqJw_Wnll8OCa',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
