const SUPABASE_URL="https://lcuaphodobwotxplcskn.supabase.co",SUPABASE_KEY="sb_publishable_30RHQ3b_M9lS0rsUb8DXzA_wY435XUk",sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY)||null;
let gastos=[],dividas=[],metas=[],cartoes=[],contas=[],orcamentos=[],assinaturas=[],modoCadastro=false,usuarioAtual=null,catChartInst=null,trendChartInst=null;
const TIPOS_CONTA={corrente:'Conta corrente',poupanca:'Poupança',investimento:'Investimento',carteira_digital:'Carteira digital'};
const CATEGORIAS_PADRAO=['Moradia','Alimentação','Transporte','Contas fixas','Cartão de crédito','Lazer','Saúde','Outros'];
const CORES=['#A8462F','#B08A3E','#3F6B52','#5B6473','#7A3B3B','#8C6BAF','#2E7D6B','#3B6FA0'];
const MARCAS_CONHECIDAS=[
  {chave:'netflix',cor:'#E50914'},{chave:'spotify',cor:'#1DB954'},{chave:'amazon prime',cor:'#00A8E1'},
  {chave:'prime video',cor:'#00A8E1'},{chave:'disney',cor:'#113CCF'},{chave:'youtube',cor:'#FF0000'},
  {chave:'hbo',cor:'#9B26B6'},{chave:'max',cor:'#002BE7'},{chave:'apple',cor:'#555555'},
  {chave:'icloud',cor:'#3693F3'},{chave:'globoplay',cor:'#FF3366'},{chave:'deezer',cor:'#FF0092'},
  {chave:'paramount',cor:'#0064FF'},{chave:'xbox',cor:'#107C10'},{chave:'playstation',cor:'#003791'},
  {chave:'academia',cor:'#2E7D32'},{chave:'gym',cor:'#2E7D32'},{chave:'aluguel',cor:'#8D6E63'},
  {chave:'internet',cor:'#0288D1'},{chave:'wifi',cor:'#0288D1'},{chave:'energia',cor:'#F9A825'},
  {chave:'luz',cor:'#F9A825'},{chave:'água',cor:'#0097A7'},{chave:'agua',cor:'#0097A7'},
  {chave:'celular',cor:'#5E35B1'},{chave:'telefone',cor:'#5E35B1'},{chave:'google',cor:'#4285F4'},
  {chave:'nubank',cor:'#8A05BE'}
];
function corAssinatura(nome,indiceFallback){const n=(nome||'').toLowerCase();const m=MARCAS_CONHECIDAS.find(x=>n.includes(x.chave));return m?m.cor:CORES[indiceFallback%CORES.length]}
const MESES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function formatarReal(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function escaparHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function mascaraMoeda(input){let v=input.value.replace(/\D/g,'');if(!v){input.value='';return}input.value=(Number(v)/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
function vibrar(ms=10){if(navigator.vibrate)navigator.vibrate(ms)}
function cssVar(nome){return getComputedStyle(document.documentElement).getPropertyValue(nome).trim()}
function valorMonetario(t){const v=String(t||'').trim().replace(/R\$|\s/g,'');const n=v.includes(',')?Number(v.replace(/\./g,'').replace(',','.')):Number(v);return Number.isFinite(n)&&n>0?n:0}
function informarErro(e,a){if(!e)return false;console.error(e);alert('Não foi possível '+a+'. Tente novamente.');return true}

function alternarModoLogin(){modoCadastro=!modoCadastro;document.getElementById('btn-login').textContent=modoCadastro?'Criar conta':'Entrar';document.getElementById('link-alternar').textContent=modoCadastro?'Já tenho conta':'Ainda não tem conta? Criar conta';document.getElementById('login-erro').textContent=''}
async function entrar(){
  const btn=document.getElementById('btn-login'),el=document.getElementById('login-erro');
  if(btn.disabled)return;
  const email=document.getElementById('login-email'),senha=document.getElementById('login-senha').value;
  el.style.color='var(--rust)';el.textContent='';
  if(!email.value.trim()||!email.checkValidity()||senha.length<6){el.textContent='Preencha um e-mail válido e senha com 6 ou mais caracteres.';return}
  if(!sb){el.textContent='Não foi possível conectar. Verifique a internet e recarregue o app.';return}
  btn.disabled=true;btn.textContent='Aguarde…';
  try{
    const {data,error}=modoCadastro?await sb.auth.signUp({email:email.value.trim(),password:senha}):await sb.auth.signInWithPassword({email:email.value.trim(),password:senha});
    if(error)el.textContent=traduzErro(error.message);
    else if(modoCadastro){el.style.color='var(--sage)';el.textContent=data.session?'Conta criada!':'Confira seu e-mail para confirmar o cadastro antes de entrar.'}
  }catch(e){el.textContent='Falha na conexão. Verifique sua internet e tente novamente.'}
  finally{btn.disabled=false;btn.textContent=modoCadastro?'Criar conta':'Entrar'}
}
function traduzErro(m){if(m.includes('Invalid login credentials'))return'E-mail ou senha incorretos.';if(m.includes('User already registered'))return'Este e-mail já tem uma conta — tente entrar.';if(m.includes('Password should be at least'))return'Senha muito curta (mínimo 6 caracteres).';if(m.includes('Unable to validate email'))return'E-mail inválido.';return'Algo deu errado: '+m}
async function sair(){await sb.auth.signOut()}
async function confirmarSair(){if(confirm('Sair da sua conta?'))await sair()}
function exportarCSV(){
  if(!gastos.length){alert('Não há lançamentos para exportar ainda.');return}
  const linhas=[['Data','Descrição','Categoria','Tipo','Valor']];
  gastos.forEach(g=>linhas.push([g.data?dataLocal(g.data).toLocaleDateString('pt-BR'):'',g.descricao||'',g.categoria||'',g.tipo==='entrada'?'Entrada':'Saída',String(g.valor).replace('.',',')]));
  const csv=linhas.map(l=>l.map(v=>`"${String(v).replace(/^[=+@-]/,"'$&").replace(/"/g,'""')}"`).join(';')).join('\r\n');
  const bom=String.fromCharCode(0xFEFF);
  const blob=new Blob([bom+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='extrato-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

let authGeneration=0,dataEpoch=0;
function limparDados(){gastos=[];dividas=[];metas=[];cartoes=[];contas=[];orcamentos=[];assinaturas=[];for(const id of ['lista-gastos-recentes','lista-dividas','lista-metas','lista-cartoes','lista-contas','lista-orcamentos','lista-assinaturas','lista-metas-resumo','carrossel-cartoes','conteudo-categorias','mf-insights','mf-report','mf-calendar','alertas-assinaturas'])document.getElementById(id)?.replaceChildren();for(const id of ['patrimonio-liquido','total-contas','total-mes','assinaturas-mensal','assinaturas-anual']){const el=document.getElementById(id);if(el)el.textContent=formatarReal(0)}if(catChartInst){catChartInst.destroy();catChartInst=null}if(trendChartInst){trendChartInst.destroy();trendChartInst=null}document.getElementById('mf-filters')?.remove();atualizarFotoPerfil()}
if(sb)sb.auth.onAuthStateChange((event,session)=>{
  const anterior=usuarioAtual?.id;usuarioAtual=session?.user||null;if(anterior!==usuarioAtual?.id){dataEpoch++;limparDados()}
  const generation=++authGeneration;
  // Run outside the auth callback; metadata updates must not restart the app.
  setTimeout(()=>{
    if(generation!==authGeneration)return;
    document.getElementById('carregando').style.display='none';
    if(!session){mostrarLogin();return}
    if(anterior!==session.user.id||!document.querySelector('.screen.active:not(#tela-login)'))mostrarApp();
    else atualizarFotoPerfil();
  },0);
});
else{
  document.getElementById('carregando').style.display='none';mostrarLogin();
  document.getElementById('login-erro').textContent='Não foi possível conectar. Verifique sua internet e recarregue o app.';
}
function mostrarLogin(){gastos=[];dividas=[];metas=[];cartoes=[];contas=[];orcamentos=[];assinaturas=[];document.body.classList.remove('mf-modal-open');document.getElementById('tela-bloqueio').style.display='none';document.getElementById('estado-dados').hidden=true;document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById('tela-login').classList.add('active');document.getElementById('tabbar').style.display='none';document.querySelectorAll('.modal-fundo').forEach(m=>m.classList.remove('aberto'));document.getElementById('perfil-popup').classList.remove('aberto')}
async function mostrarApp(){
  if(biometriaAtiva()){const ok=await verificarBiometria();if(!ok){alert('Não foi possível confirmar sua biometria. Entre novamente com e-mail e senha.');await sb.auth.signOut();return}}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('tela-resumo').classList.add('active');
  document.getElementById('tabbar').style.display='flex';
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelector('.tab[data-tela="tela-resumo"]').classList.add('active');
  atualizarFotoPerfil();
  await carregarTudo();
}
async function carregarGastos(){
  const data=[];const pageSize=500;
  for(let start=0;;start+=pageSize){
    const page=await sb.from('gastos').select('*').order('data',{ascending:false}).order('id',{ascending:false}).range(start,start+pageSize-1);
    if(page.error)return page;
    data.push(...(page.data||[]));if((page.data||[]).length<pageSize)return {data,error:null};
  }
}
let loadPromise=null,loadUser=null;
async function carregarTudo(){
  if(!sb||!usuarioAtual)return false;
  const uid=usuarioAtual.id,epoch=dataEpoch;
  if(loadPromise&&loadUser===uid+':'+epoch)return loadPromise;
  loadUser=uid+':'+epoch;
  const status=document.getElementById('estado-dados');status.hidden=false;status.textContent='Atualizando…';
  const task=(async()=>{
    try{
      const results=await Promise.all([carregarGastos(),sb.from('dividas').select('*'),sb.from('metas').select('*'),sb.from('cartoes').select('*,compras:compras_cartao(*)').order('created_at',{ascending:true}),sb.from('contas').select('*').order('created_at',{ascending:true}),sb.from('orcamentos').select('*'),sb.from('assinaturas').select('*').order('created_at',{ascending:true})]);
      if(usuarioAtual?.id!==uid||dataEpoch!==epoch)return false;
      if(results.some(r=>r.error))throw results.find(r=>r.error).error;
      [gastos,dividas,metas,cartoes,contas,orcamentos,assinaturas]=results.map(r=>r.data||[]);
      renderResumo();renderDividas();renderMetas();renderCartoes();renderContas();renderOrcamentos();renderAssinaturas();renderCarrosselCartoes();
      status.hidden=true;return true;
    }catch(e){
      console.error(e);
      if(usuarioAtual?.id===uid&&dataEpoch===epoch){status.hidden=false;status.textContent='Não foi possível atualizar. Os valores podem estar desatualizados. ';const retry=document.createElement('button');retry.textContent='Tentar novamente';retry.onclick=()=>carregarTudo();status.append(retry)}
      return false;
    }
  })();
  loadPromise=task;
  try{return await task}finally{if(loadPromise===task)loadPromise=null}
}
function irPara(id,tab){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const alvo=document.getElementById(id);alvo.style.opacity='0';alvo.classList.add('active');requestAnimationFrame(()=>requestAnimationFrame(()=>{alvo.style.opacity='1'}));document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active')}
function abrirModal(id){document.getElementById(id).classList.add('aberto')}
function fecharModal(id){document.getElementById(id).classList.remove('aberto')}
function abrirPopupPerfil(){document.getElementById('perfil-popup').classList.toggle('aberto')}
function fecharPopupPerfil(){document.getElementById('perfil-popup').classList.remove('aberto')}
document.addEventListener('click',e=>{const pop=document.getElementById('perfil-popup');const bot=e.target.closest('#perfil-mini, #mf-profile');if(pop&&!pop.contains(e.target)&&!bot)pop.classList.remove('aberto')});

let gesto=null;
document.addEventListener('touchstart',e=>{
  const swipeRow=e.target.closest('.swipe-inner');
  const tela=e.target.closest('.screen.active');
  gesto={x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,dy:0,dir:null,swipeRow,tela,pullEligible:!!usuarioAtual&&!!tela&&tela.scrollTop<=0&&!e.target.closest('.modal-fundo')};
  if(swipeRow)document.querySelectorAll('.swipe-inner.aberto').forEach(el=>{if(el!==swipeRow){el.style.transform='';el.classList.remove('aberto')}});
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(!gesto)return;
  gesto.dx=e.touches[0].clientX-gesto.x;
  gesto.dy=e.touches[0].clientY-gesto.y;
  if(!gesto.dir&&(Math.abs(gesto.dx)>8||Math.abs(gesto.dy)>8))gesto.dir=Math.abs(gesto.dx)>Math.abs(gesto.dy)?'h':'v';
  if(gesto.dir==='h'&&gesto.swipeRow){
    if(gesto.dx<0)gesto.swipeRow.style.transform=`translateX(${Math.max(gesto.dx,-88)}px)`;
  }else if(gesto.dir==='v'&&gesto.pullEligible&&gesto.tela&&gesto.tela.scrollTop<=0&&gesto.dy>0){
    const ind=document.getElementById('ptr-indicator');
    const p=Math.min(gesto.dy/70,1);
    ind.style.opacity=p;
    ind.style.transform=`translateX(-50%) translateY(${Math.min(gesto.dy*0.5,40)}px)`;
    const pronto=gesto.dy>70;
    ind.classList.toggle('pronto',pronto);
    ind.textContent=pronto?'Solte para atualizar':'Puxe para atualizar';
  }
},{passive:true});
document.addEventListener('touchend',()=>{
  if(!gesto)return;
  if(gesto.dir==='h'&&gesto.swipeRow){
    if(gesto.dx<-40){gesto.swipeRow.style.transform='translateX(-88px)';gesto.swipeRow.classList.add('aberto')}
    else{gesto.swipeRow.style.transform='';gesto.swipeRow.classList.remove('aberto')}
  }
  if(gesto.dir==='v'&&gesto.pullEligible&&gesto.tela&&gesto.tela.scrollTop<=0&&gesto.dy>70)carregarTudo();
  const ind=document.getElementById('ptr-indicator');
  ind.style.opacity='0';ind.style.transform='translateX(-50%) translateY(0)';ind.classList.remove('pronto');
  gesto=null;
});
document.addEventListener('click',e=>{
  if(e.target.closest('.swipe-bg'))return;
  document.querySelectorAll('.swipe-inner.aberto').forEach(el=>{el.style.transform='';el.classList.remove('aberto')});
});

function abrirPerfil(){const p=usuarioAtual?.user_metadata?.perfil||{};document.getElementById('perfil-nome').value=p.nome||'';document.getElementById('perfil-telefone').value=p.telefone||'';document.getElementById('perfil-renda').value=p.renda||'';document.getElementById('perfil-objetivo').value=p.objetivo||'';document.getElementById('perfil-modal-email').textContent=usuarioAtual?.email||'';atualizarFotoPerfil();const b=document.getElementById('btn-biometria');b.style.display=window.PublicKeyCredential&&location.hostname?'block':'none';document.getElementById('nota-biometria').textContent=biometriaAtiva()?'Biometria ativa neste aparelho. O Face ID será solicitado ao abrir o app.':window.PublicKeyCredential&&location.hostname?'Ative o Face ID/biometria deste aparelho após salvar. Seus dados biométricos não são enviados ao app.':'A biometria só pode ser ativada quando o app estiver publicado em HTTPS.';const bn=document.getElementById('btn-notificacoes');if(bn)bn.style.display=('serviceWorker'in navigator&&'PushManager'in window)?'block':'none';abrirModal('modal-perfil')}
async function salvarPerfil(){if(!usuarioAtual)return;const perfil={nome:document.getElementById('perfil-nome').value.trim(),telefone:document.getElementById('perfil-telefone').value.trim(),renda:document.getElementById('perfil-renda').value.trim(),objetivo:document.getElementById('perfil-objetivo').value.trim()},r=await sb.auth.updateUser({data:{...usuarioAtual.user_metadata,perfil}});if(informarErro(r.error,'salvar seu perfil'))return;usuarioAtual=r.data.user;atualizarFotoPerfil();alert('Perfil salvo com sucesso.');fecharModal('modal-perfil')}
function bytesAleatorios(){const b=new Uint8Array(32);crypto.getRandomValues(b);return b}
async function ativarBiometria(){if(!usuarioAtual||!window.PublicKeyCredential||!location.hostname){alert('A biometria estará disponível no link publicado do app.');return}try{await navigator.credentials.create({publicKey:{challenge:bytesAleatorios(),rp:{name:'Gestão de Gastos',id:location.hostname},user:{id:new TextEncoder().encode(usuarioAtual.id),name:usuarioAtual.email||usuarioAtual.id,displayName:usuarioAtual.user_metadata?.perfil?.nome||usuarioAtual.email||'Usuário'},pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],authenticatorSelection:{residentKey:'required',userVerification:'required'},timeout:60000}});localStorage.setItem(chaveBiometria(),'true');alert('Biometria ativada neste aparelho. Na próxima abertura, use o Face ID para desbloquear o app.');fecharModal('modal-perfil')}catch(e){console.error(e);alert('A biometria não foi ativada. Verifique se o Face ID está configurado neste aparelho.')}}
async function verificarBiometria(){try{await navigator.credentials.get({publicKey:{challenge:bytesAleatorios(),rpId:location.hostname,userVerification:'required',timeout:60000}});return true}catch(e){return false}}
let travado=false;
function mostrarBloqueio(){travado=true;document.getElementById('tela-bloqueio').style.display='flex';tentarDesbloquear()}
async function tentarDesbloquear(){const ok=await verificarBiometria();if(ok){travado=false;document.getElementById('tela-bloqueio').style.display='none'}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&usuarioAtual&&biometriaAtiva()&&!travado)mostrarBloqueio()});

const VAPID_PUBLIC_KEY='BOlsqHdImQ2kMW6ZZx8qS7LToRNGwis9cZ07b6K7p8P13iuWrsYRVT9jDX7TF3UCTtKSzEMO-hSm9DqyVz0-l8Q';
function urlBase64ToUint8Array(base64String){const padding='='.repeat((4-base64String.length%4)%4);const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');const rawData=atob(base64);const outputArray=new Uint8Array(rawData.length);for(let i=0;i<rawData.length;++i)outputArray[i]=rawData.charCodeAt(i);return outputArray}
async function ativarNotificacoes(){
  if(!('serviceWorker'in navigator)||!('PushManager'in window)){alert('Seu navegador não suporta notificações push.');return}
  const perm=await Notification.requestPermission();
  if(perm!=='granted'){alert('Permissão de notificação não concedida.');return}
  try{
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)});
    const json=sub.toJSON();
    const{error}=await sb.from('push_subscriptions').upsert({endpoint:json.endpoint,p256dh:json.keys.p256dh,auth:json.keys.auth},{onConflict:'endpoint'});
    if(informarErro(error,'ativar as notificações'))return;
    alert('Notificações ativadas! Você será avisado 3 dias antes de cada assinatura vencer, mesmo com o app fechado.');
  }catch(e){console.error(e);alert('Não foi possível ativar as notificações neste aparelho.')}
}
function chaveBiometria(){return usuarioAtual?'biometria-ativa-'+usuarioAtual.id:''}
function biometriaAtiva(){return!!chaveBiometria()&&localStorage.getItem(chaveBiometria())==='true'}
function chaveFotoPerfil(){return usuarioAtual?'foto-perfil-'+usuarioAtual.id:''}
function atualizarFotoPerfil(){const foto=chaveFotoPerfil()?localStorage.getItem(chaveFotoPerfil()):'',mini=document.getElementById('perfil-mini'),preview=document.getElementById('perfil-foto-preview'),popAvatar=document.getElementById('perfil-popup-avatar'),popNome=document.getElementById('perfil-popup-nome'),popEmail=document.getElementById('perfil-popup-email'),nome=usuarioAtual?.user_metadata?.perfil?.nome,iniciais=(nome||usuarioAtual?.email||'MP').split(/\s|@/).filter(Boolean).slice(0,2).map(p=>p[0]).join('').toUpperCase();if(mini)mini.innerHTML=foto?`<img src="${foto}" alt="Foto do perfil">`:iniciais;if(preview)preview.innerHTML=foto?`<img src="${foto}" alt="Foto do perfil">`:'Adicionar foto';if(popAvatar)popAvatar.innerHTML=foto?`<img src="${foto}" alt="Foto do perfil">`:iniciais;if(popNome)popNome.textContent=nome||'Minha conta';if(popEmail)popEmail.textContent=usuarioAtual?.email||''}
function alterarFotoPerfil(e){const a=e.target.files?.[0];if(!a)return;if(!a.type.startsWith('image/')){alert('Escolha um arquivo de imagem.');return}const l=new FileReader;l.onload=()=>{const i=new Image;i.onload=()=>{const t=240,s=Math.max(t/i.width,t/i.height),w=Math.round(i.width*s),h=Math.round(i.height*s),c=document.createElement('canvas');c.width=t;c.height=t;c.getContext('2d').drawImage(i,(t-w)/2,(t-h)/2,w,h);try{localStorage.setItem(chaveFotoPerfil(),c.toDataURL('image/jpeg',.82));atualizarFotoPerfil()}catch(x){alert('Não foi possível guardar esta foto. Escolha uma imagem menor.')}};i.src=l.result};l.readAsDataURL(a)}

function selecionarCategoria(sel){if(sel.value!=='__nova__')return;const c=(prompt('Nome da nova categoria:')||'').trim();if(!c){sel.selectedIndex=0;return}const existente=[...sel.options].find(o=>o.value.toLowerCase()===c.toLowerCase());if(existente){existente.selected=true;return}const o=document.createElement('option');o.value=c;o.textContent=c;sel.insertBefore(o,sel.lastElementChild);o.selected=true}
async function salvarGasto(){const descricao=document.getElementById('gasto-descricao').value.trim(),valor=valorMonetario(document.getElementById('gasto-valor').value),categoria=document.getElementById('gasto-categoria').value,tipo=document.getElementById('gasto-tipo').value;if(!descricao||!valor){alert('Preencha a descrição e um valor válido.');return}const{error}=await sb.from('gastos').insert({descricao,valor,categoria,tipo});if(informarErro(error,'salvar o gasto'))return;document.getElementById('gasto-descricao').value='';document.getElementById('gasto-valor').value='';document.getElementById('gasto-tipo').value='saida';fecharModal('modal-gasto');await carregarTudo()}
async function excluirGasto(id){if(!confirm('Excluir este gasto? Esta ação não pode ser desfeita.'))return;const{error}=await sb.from('gastos').delete().eq('id',id);if(informarErro(error,'excluir o gasto'))return;await carregarTudo()}

function gastosDoMes(referencia=new Date()){
  return gastos.filter(g=>{if(!g.data)return false;const d=dataLocal(g.data);return d.getFullYear()===referencia.getFullYear()&&d.getMonth()===referencia.getMonth()});
}
function renderResumo(){
  const gm=gastosDoMes().filter(g=>g.tipo!=='entrada');
  const total=gm.reduce((s,g)=>s+Number(g.valor),0);
  document.getElementById('total-mes').textContent=formatarReal(total);

  const totalContas=contas.reduce((s,c)=>s+Number(c.saldo_atual),0);
  const totalFaturasAbertas=cartoes.reduce((s,c)=>s+faturaAtualCartao(c),0);
  document.getElementById('total-contas').textContent=formatarReal(totalContas);
  document.getElementById('patrimonio-liquido').textContent=formatarReal(totalContas-totalFaturasAbertas);

  const pc=Object.create(null);
  gm.forEach(g=>{const cat=g.categoria||'Outros';pc[cat]=(pc[cat]||0)+Number(g.valor)});
  renderCategorias(pc,total);
  renderTendencia();

  const l=document.getElementById('lista-gastos-recentes');
  const termoBusca=(document.getElementById('busca-extrato')?.value||'').trim().toLowerCase();
  const listaExtrato=termoBusca?gastos.filter(g=>(g.descricao||'').toLowerCase().includes(termoBusca)||(g.categoria||'').toLowerCase().includes(termoBusca)):gastos.slice(0,6);
  l.innerHTML=listaExtrato.length?listaExtrato.map(g=>{const entrada=g.tipo==='entrada';return`<div class="gasto-row"><div class="swipe-bg" onclick="excluirGasto('${g.id}')">Excluir</div><div class="swipe-inner"><div class="gasto-info"><div class="gasto-desc">${escaparHtml(g.descricao)}</div><div class="gasto-meta">${escaparHtml(g.categoria||'Outros')}</div></div><span class="gasto-valor tabular" style="color:${entrada?'var(--sage)':'var(--rust)'}">${entrada?'+':'−'}${formatarReal(g.valor)}</span></div></div>`}).join(''):termoBusca?`<div class="vazio">Nenhum resultado para "${escaparHtml(termoBusca)}".</div>`:'<div class="vazio">Nenhum gasto lançado ainda. Toque em "+ novo".</div>';

  const lm=document.getElementById('lista-metas-resumo');
  lm.innerHTML=metas.length?metas.slice(0,3).map(m=>{const p=Math.min((Number(m.valor_atual)||0)/Number(m.valor_alvo),1);return`<div class="item-row"><div class="linha-entre"><span class="nome">${escaparHtml(m.nome)}</span><span class="detalhe tabular">${formatarReal(m.valor_atual)} / ${formatarReal(m.valor_alvo)}</span></div><div class="trilha"><div class="progresso" style="width:${p*100}%"></div></div></div>`}).join(''):'<div class="vazio">Nenhuma meta cadastrada.</div>';
}

function renderCategorias(pc,total){
  const entries=Object.entries(pc).sort((a,b)=>b[1]-a[1]);
  const cont=document.getElementById('conteudo-categorias');
  const chartWrap=document.getElementById('catChart').parentElement;
  if(!entries.length){cont.innerHTML='<div class="vazio">Nenhum gasto lançado ainda. Toque em "+ novo".</div>';chartWrap.style.display='none';if(catChartInst){catChartInst.destroy();catChartInst=null}return}
  chartWrap.style.display='block';
  cont.innerHTML=entries.map(([n,v],i)=>`<div class="cat-row"><span class="cat-dot" style="background:${CORES[i%CORES.length]}"></span><span class="cat-name">${escaparHtml(n)}</span><span class="cat-value tabular">${formatarReal(v)} · ${Math.round(v/total*100)}%</span></div>`).join('');
  const ctx=document.getElementById('catChart');
  if(typeof Chart==='undefined')return;
  if(catChartInst){catChartInst.data.labels=entries.map(e=>e[0]);catChartInst.data.datasets[0].data=entries.map(e=>e[1]);catChartInst.data.datasets[0].backgroundColor=entries.map((e,i)=>CORES[i%CORES.length]);catChartInst.update('none');return}
  catChartInst=new Chart(ctx,{type:'doughnut',data:{labels:entries.map(e=>e[0]),datasets:[{data:entries.map(e=>e[1]),backgroundColor:entries.map((e,i)=>CORES[i%CORES.length]),borderWidth:2,borderColor:cssVar('--card')}]},options:{cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.label+': '+formatarReal(c.raw)}}}}});
}

function renderTendencia(){
  const agora=new Date();const labels=[],valores=[];
  for(let i=5;i>=0;i--){
    const d=new Date(agora.getFullYear(),agora.getMonth()-i,1);
    labels.push(MESES[d.getMonth()]);
    const soma=gastos.filter(g=>{if(!g.data||g.tipo==='entrada')return false;const gd=dataLocal(g.data);return gd.getFullYear()===d.getFullYear()&&gd.getMonth()===d.getMonth()}).reduce((s,g)=>s+Number(g.valor),0);
    valores.push(soma);
  }
  const ctx=document.getElementById('trendChart');
  if(typeof Chart==='undefined')return;
  if(trendChartInst){trendChartInst.data.labels=labels;trendChartInst.data.datasets[0].data=valores;trendChartInst.update('none');return}
  trendChartInst=new Chart(ctx,{type:'bar',data:{labels,datasets:[{data:valores,backgroundColor:cssVar('--rust'),borderRadius:4,maxBarThickness:20}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:{display:false},ticks:{color:cssVar('--ink-soft')}},y:{grid:{color:cssVar('--line')},ticks:{color:cssVar('--ink-soft'),callback:v=>'R$ '+v}}},plugins:{legend:{display:false}}}});
}

async function salvarDivida(){const nome=document.getElementById('divida-nome').value.trim(),valor_total=valorMonetario(document.getElementById('divida-valor').value),parcelas_total=Number(document.getElementById('divida-parcelas').value)||1;if(!Number.isInteger(parcelas_total)||parcelas_total<1){alert('Informe um número inteiro de parcelas maior que zero.');return}if(!nome||!valor_total){alert('Preencha o nome e o valor.');return}const{error}=await sb.from('dividas').insert({nome,valor_total,parcelas_total,parcelas_pagas:0});if(informarErro(error,'salvar a dívida'))return;document.getElementById('divida-nome').value='';document.getElementById('divida-valor').value='';document.getElementById('divida-parcelas').value='';fecharModal('modal-divida');await carregarTudo()}
async function pagarParcela(id){const d=dividas.find(x=>x.id===id);if(!d||d.parcelas_pagas>=d.parcelas_total)return;const{error}=await sb.from('dividas').update({parcelas_pagas:d.parcelas_pagas+1}).eq('id',id);if(informarErro(error,'atualizar a dívida'))return;await carregarTudo()}
async function excluirDivida(id){if(!confirm('Excluir esta dívida?'))return;const{error}=await sb.from('dividas').delete().eq('id',id);if(informarErro(error,'excluir a dívida'))return;await carregarTudo()}
function renderDividas(){const l=document.getElementById('lista-dividas');if(!dividas.length){l.innerHTML='<div class="card"><div class="vazio">Nenhuma dívida cadastrada.</div></div>';return}l.innerHTML=dividas.map(d=>{const vp=d.valor_total/d.parcelas_total,q=d.parcelas_pagas>=d.parcelas_total;return`<div class="card item-row"><div class="linha-entre"><span class="nome">${escaparHtml(d.nome)}</span><span class="status ${q?'quitada':'pendente'}">${q?'Quitada':d.parcelas_pagas+'/'+d.parcelas_total}</span></div><div class="detalhe tabular">${formatarReal(vp)} por parcela · total ${formatarReal(d.valor_total)}</div><div class="trilha"><div class="progresso gold" style="width:${d.parcelas_pagas/d.parcelas_total*100}%"></div></div><div style="margin-top:8px">${!q?`<span role="button" tabindex="0" class="link-acao" onclick="pagarParcela('${d.id}')">Marcar parcela como paga</span><span style="margin:0 6px;color:var(--line)">·</span>`:''}<span role="button" tabindex="0" class="link-acao" style="color:var(--rust)" onclick="excluirDivida('${d.id}')">Excluir</span></div></div>`}).join('')}

async function salvarMeta(){const nome=document.getElementById('meta-nome').value.trim(),valor_alvo=valorMonetario(document.getElementById('meta-valor').value);if(!nome||!valor_alvo){alert('Preencha o nome e o valor da meta.');return}const{error}=await sb.from('metas').insert({nome,valor_alvo,valor_atual:0});if(informarErro(error,'salvar a meta'))return;document.getElementById('meta-nome').value='';document.getElementById('meta-valor').value='';fecharModal('modal-meta');await carregarTudo()}
async function aportar(id){const v=valorMonetario(prompt('Quanto você quer guardar nesta meta? (R$)'));if(!v)return;const m=metas.find(x=>x.id===id);if(!m)return;const{error}=await sb.from('metas').update({valor_atual:Number(m.valor_atual)+v}).eq('id',id);if(informarErro(error,'registrar o aporte'))return;await carregarTudo()}
async function excluirMeta(id){if(!confirm('Excluir esta meta?'))return;const{error}=await sb.from('metas').delete().eq('id',id);if(informarErro(error,'excluir a meta'))return;await carregarTudo()}
function renderMetas(){const l=document.getElementById('lista-metas');if(!metas.length){l.innerHTML='<div class="card"><div class="vazio">Nenhuma meta cadastrada.</div></div>';return}l.innerHTML=metas.map(m=>{const p=Math.min((Number(m.valor_atual)||0)/Number(m.valor_alvo),1),a=p>=1;return`<div class="card item-row"><div class="linha-entre"><span class="nome">${escaparHtml(m.nome)}</span><span class="status ${a?'quitada':'pendente'}">${a?'Atingida':Math.round(p*100)+'%'}</span></div><div class="detalhe tabular">${formatarReal(m.valor_atual)} de ${formatarReal(m.valor_alvo)}</div><div class="trilha"><div class="progresso" style="width:${p*100}%"></div></div><div style="margin-top:8px">${!a?`<span role="button" tabindex="0" class="link-acao" onclick="aportar('${m.id}')">Guardar dinheiro nesta meta</span><span style="margin:0 6px;color:var(--line)">·</span>`:''}<span role="button" tabindex="0" class="link-acao" style="color:var(--rust)" onclick="excluirMeta('${m.id}')">Excluir</span></div></div>`}).join('')}

function mesesEntre(a,b){const d1=dataLocal(a),d2=dataLocal(b);return(d2.getFullYear()-d1.getFullYear())*12+(d2.getMonth()-d1.getMonth())}
function valorParcela(x){return Number(x.valor_total)/Number(x.parcelas)}
function parcelaNumero(x,referencia=new Date()){return mesesEntre(x.data_compra,referencia)+1}
function compraAtivaEm(x,referencia=new Date()){const n=parcelaNumero(x,referencia);return n>=1&&n<=x.parcelas}
function faturaAtualCartao(c){return(c.compras||[]).filter(x=>compraAtivaEm(x)).reduce((s,x)=>s+valorParcela(x),0)}
function comprometidoCartao(c){return(c.compras||[]).reduce((s,x)=>{const n=parcelaNumero(x);const restantes=Math.max(0,Math.min(x.parcelas,x.parcelas-n+1));return n>x.parcelas?s:s+valorParcela(x)*restantes},0)}
async function salvarCartao(){const nome=document.getElementById('cartao-nome').value.trim(),banco=document.getElementById('cartao-banco').value.trim(),limite=valorMonetario(document.getElementById('cartao-limite').value),dia_fechamento=parseInt(document.getElementById('cartao-fechamento').value)||null,dia_vencimento=parseInt(document.getElementById('cartao-vencimento').value)||null;if([dia_fechamento,dia_vencimento].some(d=>d!==null&&(d<1||d>31))){alert('Os dias do cartão devem estar entre 1 e 31.');return}if(!nome||!limite){alert('Informe o nome e o limite do cartão.');return}const{error}=await sb.from('cartoes').insert({nome,banco,limite,dia_fechamento,dia_vencimento});if(informarErro(error,'salvar o cartão'))return;document.getElementById('cartao-nome').value='';document.getElementById('cartao-banco').value='';document.getElementById('cartao-limite').value='';document.getElementById('cartao-fechamento').value='';document.getElementById('cartao-vencimento').value='';fecharModal('modal-cartao');await carregarTudo()}
async function novaCompraCartao(id){const nome=prompt('Descrição da compra:');if(!nome)return;const v=valorMonetario(prompt('Valor total da compra (R$):',''));if(!v)return;const parcelas=Math.max(1,parseInt(prompt('Número de parcelas (1 para compra à vista):','1'))||1);const{error}=await sb.from('compras_cartao').insert({cartao_id:id,nome,valor_total:v,parcelas,data_compra:new Date().toISOString().slice(0,10)});if(informarErro(error,'salvar a compra'))return;await carregarTudo()}
function encontrarCompra(id){for(const c of cartoes){const f=(c.compras||[]).find(x=>x.id===id);if(f)return f}return null}
async function editarCompra(id){const compra=encontrarCompra(id);if(!compra)return;const nome=prompt('Descrição da compra:',compra.nome);if(!nome)return;const v=valorMonetario(prompt('Valor total da compra (R$):',String(compra.valor_total).replace('.',',')));if(!v)return;const parcelas=Math.max(1,parseInt(prompt('Número de parcelas:',String(compra.parcelas)))||1);const{error}=await sb.from('compras_cartao').update({nome,valor_total:v,parcelas}).eq('id',id);if(informarErro(error,'atualizar a compra'))return;await carregarTudo()}
async function excluirCompra(id){if(!confirm('Excluir esta compra?'))return;const{error}=await sb.from('compras_cartao').delete().eq('id',id);if(informarErro(error,'excluir a compra'))return;await carregarTudo()}
async function excluirCartao(id){if(!confirm('Excluir este cartão? As compras lançadas nele também serão removidas.'))return;const{error}=await sb.from('cartoes').delete().eq('id',id);if(informarErro(error,'excluir o cartão'))return;await carregarTudo()}
function renderCarrosselCartoes(){const box=document.getElementById('carrossel-cartoes');if(!box)return;if(!cartoes.length){box.style.display='none';return}box.style.display='flex';box.innerHTML=cartoes.map((c,i)=>{const faturaAtual=faturaAtualCartao(c),comprometido=comprometidoCartao(c),pct=c.limite?Math.min(100,comprometido/c.limite*100):0,venc=c.dia_vencimento?`vence dia ${c.dia_vencimento}`:'defina o vencimento';return`<div class="chip-cartao c${(i%4)+1}"><div class="ch-top"><span>${escaparHtml(c.banco||c.nome)}</span></div><div class="ch-val">${formatarReal(faturaAtual)}</div><div class="ch-bar"><i style="width:${pct}%"></i></div><div class="ch-due">${venc}</div></div>`}).join('')}
function renderCartoes(){const box=document.getElementById('lista-cartoes');if(!box)return;const a=cartoes;if(!a.length){box.innerHTML='<div class="card"><div class="vazio">Nenhum cartão cadastrado. Toque em "+ Novo".</div></div>';return}box.innerHTML=a.map((c,i)=>{const faturaAtual=faturaAtualCartao(c),comprometido=comprometidoCartao(c),disp=Math.max(0,c.limite-comprometido),pctUsado=c.limite?Math.min(100,comprometido/c.limite*100):0,ciclo=c.dia_fechamento&&c.dia_vencimento?`Fecha dia ${c.dia_fechamento} · vence dia ${c.dia_vencimento}`:'Defina o ciclo de fechamento e vencimento';return`<div class="cartao-visual c${(i%4)+1}"><div class="cartao-topo"><div><div class="cartao-nome">${escaparHtml(c.nome)}</div><div class="cartao-banco">${escaparHtml(c.banco||'Cartão de crédito')}</div></div><span>💳</span></div><div class="cartao-limite"><small>Fatura atual · ${ciclo}</small><strong class="tabular">${formatarReal(faturaAtual)}</strong></div><div class="cartao-info"><div><small>Comprometido</small><b class="tabular">${formatarReal(comprometido)}</b></div><div><small>Disponível</small><b class="tabular">${formatarReal(disp)}</b></div></div><div class="trilha" style="margin-top:10px;background:rgba(255,255,255,.25)"><div class="progresso" style="width:${pctUsado}%;background:#fff"></div></div></div><div class="card"><h3 style="margin:0 0 10px;font-family:var(--serif);font-size:14.5px">Compras parceladas</h3>${(c.compras||[]).length?c.compras.map(x=>{const n=parcelaNumero(x),quitada=n>x.parcelas;return`<div class="compra-row"><div onclick="editarCompra('${x.id}')" style="cursor:pointer"><b>${escaparHtml(x.nome)}</b>${x.parcelas>1?`<span class="parcelas-tag">${quitada?'quitada':Math.max(1,n)+'/'+x.parcelas+' parcelas'}</span>`:'<small>À vista</small>'}</div><div style="display:flex;align-items:center;gap:4px"><strong class="tabular">${formatarReal(valorParcela(x))}</strong><button class="btn-excluir" onclick="event.stopPropagation();excluirCompra('${x.id}')">✕</button></div></div>`}).join(''):'<div class="vazio">Nenhuma compra cadastrada.</div>'}<div class="cartao-acoes"><button onclick="novaCompraCartao('${c.id}')">+ Compra</button><button onclick="excluirCartao('${c.id}')">Excluir</button></div></div>`}).join('')}

const NOMES_MES_ABREV=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function renderOrcamentos(){const box=document.getElementById('lista-orcamentos');if(!box)return;const gm=gastosDoMes().filter(g=>g.tipo!=='entrada');const porCat=Object.create(null);gm.forEach(g=>{const c=g.categoria||'Outros';porCat[c]=(porCat[c]||0)+Number(g.valor)});const cats=[...new Set([...CATEGORIAS_PADRAO,...orcamentos.map(o=>o.categoria),...Object.keys(porCat)])];box.innerHTML=cats.map(cat=>{const orc=orcamentos.find(o=>o.categoria===cat);const gasto=porCat[cat]||0;if(!orc)return`<div class="item-row"><div class="linha-entre"><span class="nome">${escaparHtml(cat)}</span><span role="button" tabindex="0" class="link-acao" onclick="definirOrcamento(${escaparHtml(JSON.stringify(cat))})">Definir teto</span></div>${gasto?`<div class="detalhe tabular">${formatarReal(gasto)} gastos neste mês</div>`:''}</div>`;const p=gasto/Number(orc.valor_limite);const cor=p>=1?'rust':p>=0.7?'gold':'';return`<div class="item-row"><div class="linha-entre"><span class="nome">${escaparHtml(cat)}</span><span class="detalhe tabular">${formatarReal(gasto)} / ${formatarReal(orc.valor_limite)}</span></div><div class="trilha"><div class="progresso ${cor}" style="width:${Math.min(p*100,100)}%"></div></div><span role="button" tabindex="0" class="link-acao" onclick="definirOrcamento(${escaparHtml(JSON.stringify(cat))})">Editar teto</span></div>`}).join('')||'<div class="vazio">Nenhuma categoria com gasto ou orçamento ainda.</div>'}
async function definirOrcamento(categoria){const atual=orcamentos.find(o=>o.categoria===categoria);const entrada=prompt('Teto mensal para "'+categoria+'" (R$):',atual?String(atual.valor_limite):'');if(entrada===null)return;const v=valorMonetario(entrada);if(!v){if(atual&&confirm('Remover o orçamento desta categoria?')){const{error}=await sb.from('orcamentos').delete().eq('id',atual.id);if(informarErro(error,'remover o orçamento'))return;await carregarTudo()}return}const{error}=await sb.from('orcamentos').upsert({categoria,valor_limite:v},{onConflict:'user_id,categoria'});if(informarErro(error,'salvar o orçamento'))return;await carregarTudo()}

function dataLocal(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?new Date(value+'T00:00:00'):new Date(value)}
function diaNoMes(ano,mes,dia){return new Date(ano,mes,Math.min(Math.max(1,Number(dia)||1),new Date(ano,mes+1,0).getDate()))}
function proximaCobranca(a,referencia=new Date()){
  const hoje=new Date(referencia.getFullYear(),referencia.getMonth(),referencia.getDate());
  const anual=a.ciclo==='anual',mes=anual?Number(a.mes_cobranca||1)-1:hoje.getMonth();
  let d=diaNoMes(hoje.getFullYear(),mes,a.dia_cobranca);
  if(d<hoje)d=diaNoMes(hoje.getFullYear()+(anual?1:0),mes+(anual?0:1),a.dia_cobranca);
  return d;
}
function diasAte(d){return Math.ceil((d-new Date())/86400000)}
async function salvarAssinatura(){const nome=document.getElementById('assinatura-nome').value.trim(),valor=valorMonetario(document.getElementById('assinatura-valor').value),ciclo=document.getElementById('assinatura-ciclo').value,dia_cobranca=Math.min(31,Math.max(1,parseInt(document.getElementById('assinatura-dia').value)||1)),mes_cobranca=ciclo==='anual'?Math.min(12,Math.max(1,parseInt(document.getElementById('assinatura-mes').value)||1)):null;if(!nome||!valor){alert('Preencha o nome e o valor.');return}const{error}=await sb.from('assinaturas').insert({nome,valor,ciclo,dia_cobranca,mes_cobranca});if(informarErro(error,'salvar a assinatura'))return;document.getElementById('assinatura-nome').value='';document.getElementById('assinatura-valor').value='';document.getElementById('assinatura-dia').value='';document.getElementById('assinatura-mes').value='';fecharModal('modal-assinatura');await carregarTudo()}
async function excluirAssinatura(id){if(!confirm('Excluir esta assinatura?'))return;const{error}=await sb.from('assinaturas').delete().eq('id',id);if(informarErro(error,'excluir a assinatura'))return;await carregarTudo()}
function renderAssinaturas(){const box=document.getElementById('lista-assinaturas'),alertas=document.getElementById('alertas-assinaturas');if(!box)return;const ativas=assinaturas.filter(a=>a.ativo!==false);const totalMensal=ativas.reduce((s,a)=>s+(a.ciclo==='anual'?Number(a.valor)/12:Number(a.valor)),0);const totalAnual=ativas.reduce((s,a)=>s+(a.ciclo==='anual'?Number(a.valor):Number(a.valor)*12),0);document.getElementById('assinaturas-mensal').textContent=formatarReal(totalMensal);document.getElementById('assinaturas-anual').textContent=formatarReal(totalAnual);const proximas=ativas.map(a=>({a,d:proximaCobranca(a),dias:diasAte(proximaCobranca(a))})).filter(x=>x.dias<=3);alertas.innerHTML=proximas.length?proximas.map(x=>`<div class="alerta-strip">⏰ ${escaparHtml(x.a.nome)} vence ${x.dias<=0?'hoje':'em '+x.dias+' dia(s)'} — ${formatarReal(x.a.valor)}</div>`).join(''):'';if(!assinaturas.length){box.innerHTML='<div class="vazio">Nenhuma assinatura cadastrada. Toque em "+ Nova".</div>';return}box.innerHTML=assinaturas.map((a,i)=>{const prox=proximaCobranca(a);return`<div class="assinatura-row"><div class="swipe-bg" onclick="excluirAssinatura('${a.id}')">Excluir</div><div class="swipe-inner"><div class="assinatura-ico" style="background:${corAssinatura(a.nome,i)}">${escaparHtml(a.nome.slice(0,1).toUpperCase())}</div><div class="assinatura-info"><b>${escaparHtml(a.nome)}</b><small>${a.ciclo==='anual'?'anual':'mensal'} · próxima em ${prox.getDate()}/${prox.getMonth()+1}</small></div><span class="tabular" style="font-weight:700;font-size:12.5px">${formatarReal(a.valor)}</span></div></div>`}).join('')}
async function salvarConta(){const instituicao=document.getElementById('conta-instituicao').value.trim(),tipo=document.getElementById('conta-tipo').value,saldo_atual=valorMonetario(document.getElementById('conta-saldo').value);if(!instituicao){alert('Informe a instituição.');return}const{error}=await sb.from('contas').insert({instituicao,tipo,saldo_atual});if(informarErro(error,'salvar a conta'))return;document.getElementById('conta-instituicao').value='';document.getElementById('conta-saldo').value='';fecharModal('modal-conta');await carregarTudo()}
async function excluirConta(id){if(!confirm('Excluir esta conta?'))return;const{error}=await sb.from('contas').delete().eq('id',id);if(informarErro(error,'excluir a conta'))return;await carregarTudo()}
function renderContas(){const l=document.getElementById('lista-contas');if(!l)return;if(!contas.length){l.innerHTML='<div class="vazio">Nenhuma conta cadastrada. Toque em "+ Nova".</div>';return}l.innerHTML=contas.map(c=>`<div class="conta-row"><div class="swipe-bg" onclick="excluirConta('${c.id}')">Excluir</div><div class="swipe-inner"><div class="conta-info"><div class="conta-nome">${escaparHtml(c.instituicao)}</div><div class="conta-tipo">${TIPOS_CONTA[c.tipo]||c.tipo}</div></div><span class="conta-saldo tabular">${formatarReal(c.saldo_atual)}</span></div></div>`).join('')}

const pendingActions=new Set();
['salvarGasto','salvarDivida','pagarParcela','salvarMeta','aportar','salvarCartao','novaCompraCartao','editarCompra','salvarAssinatura','salvarConta','salvarPerfil','definirOrcamento','excluirGasto','excluirDivida','excluirMeta','excluirCartao','excluirCompra','excluirConta','excluirAssinatura'].forEach(name=>{
  const action=window[name];
  window[name]=async function(...args){
    const key=name+':'+(args[0]||'');if(pendingActions.has(key))return;
    pendingActions.add(key);
    const buttons=[...document.querySelectorAll('.modal-fundo.aberto .modal-salvar')];
    buttons.forEach(b=>b.disabled=true);
    try{return await action.apply(this,args)}catch(e){informarErro(e,'concluir a operação')}finally{pendingActions.delete(key);buttons.forEach(b=>b.disabled=false)}
  };
});
document.getElementById('login-senha').addEventListener('keydown',e=>{if(e.key==='Enter')entrar()});
document.querySelectorAll('.modal-fundo').forEach(modal=>{
  modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  const title=modal.querySelector('h3');if(title){title.id=modal.id+'-titulo';modal.setAttribute('aria-labelledby',title.id)}
});
document.querySelectorAll('label').forEach(label=>{const input=label.nextElementSibling;if(input?.matches('input,select,textarea')&&input.id)label.htmlFor=input.id});

document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"]')){e.preventDefault();e.target.click()}});
