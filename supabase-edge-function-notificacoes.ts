// Cole este código no painel do Supabase: Edge Functions > New Function
// Nome sugerido da função: checar-assinaturas
//
// Segredos necessários (Edge Functions > Manage secrets, ou `supabase secrets set`):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY  -> gerados junto com este código (não ficam no repositório)
//   SUPABASE_SERVICE_ROLE_KEY            -> Settings > API > service_role (NUNCA exponha esta chave no app)
// SUPABASE_URL já existe automaticamente em toda Edge Function.

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

webpush.setVapidDetails(
  "mailto:contato@example.com",
  vapidPublicKey,
  vapidPrivateKey
);

function proximaCobranca(a: any, referencia: Date): Date {
  if (a.ciclo === "anual") {
    let ano = referencia.getFullYear();
    let d = new Date(ano, (a.mes_cobranca || 1) - 1, a.dia_cobranca);
    if (d < referencia) d = new Date(ano + 1, (a.mes_cobranca || 1) - 1, a.dia_cobranca);
    return d;
  }
  let d = new Date(referencia.getFullYear(), referencia.getMonth(), a.dia_cobranca);
  if (d < referencia) d = new Date(referencia.getFullYear(), referencia.getMonth() + 1, a.dia_cobranca);
  return d;
}

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const { data: assinaturas, error } = await supabase
    .from("assinaturas")
    .select("*")
    .eq("ativo", true);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let enviados = 0;
  for (const a of assinaturas ?? []) {
    const prox = proximaCobranca(a, hoje);
    const dias = Math.round((prox.getTime() - hoje.getTime()) / 86400000);
    if (dias !== 3) continue;

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", a.user_id);

    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({
            title: "Assinatura vence em 3 dias",
            body: `${a.nome} — R$ ${Number(a.valor).toFixed(2).replace(".", ",")}`,
          })
        );
        enviados++;
      } catch (e) {
        console.error("Falha ao enviar push", e);
        if (e?.statusCode === 410 || e?.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }
  }

  return new Response(JSON.stringify({ ok: true, enviados }), {
    headers: { "Content-Type": "application/json" },
  });
});
