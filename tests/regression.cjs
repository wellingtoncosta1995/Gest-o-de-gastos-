// Run with: TZ=America/Sao_Paulo node --test tests/regression.cjs
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
function core(){
 const elements=new Map(),element=()=>({style:{},addEventListener(){},classList:{remove(){},add(){}},replaceChildren(){},querySelectorAll(){return []}});
 const context={console,navigator:{},location:{hostname:'example.test'},document:{addEventListener(){},querySelectorAll(){return []},getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)}},localStorage:{getItem(){return null}},setTimeout,clearTimeout,alert(){}};
 context.window=context;context.supabase={createClient(){return {auth:{onAuthStateChange(){}}}}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'app-core.js'),'utf8'),context);return {run:s=>vm.runInContext(s,context),context};
}
test('due today stays today; short months clamp; annual charge advances',()=>{
 const {run}=core();
 assert.equal(run('proximaCobranca({dia_cobranca:9},new Date(2026,8,9,23)).getDate()'),9);
 assert.equal(run('proximaCobranca({dia_cobranca:31},new Date(2026,1,10)).getDate()'),28);
 assert.equal(run('proximaCobranca({dia_cobranca:31},new Date(2028,1,10)).getDate()'),29);
 assert.equal(run("proximaCobranca({ciclo:'anual',mes_cobranca:2,dia_cobranca:29},new Date(2026,2,1)).getFullYear()"),2027);
});
test('calendar dates retain their local month',()=>{
 const {run}=core();assert.equal(run("dataLocal('2026-09-01').getMonth()"),8);assert.equal(run("mesesEntre('2026-09-01',new Date(2026,8,9))"),0);
});
test('budget excludes income and safely handles quotes in category names',()=>{
 const {run,context}=core();run(`gastos=[{tipo:'entrada',valor:500,categoria:"D'água",data:new Date().toISOString()},{tipo:'saida',valor:10,categoria:"D'água",data:new Date().toISOString()}];renderOrcamentos()`);
 const html=context.document.getElementById('lista-orcamentos').innerHTML;
 assert.match(html,/10,00/);assert.doesNotMatch(html,/510,00/);assert.match(html,/definirOrcamento\(&quot;D&#39;água&quot;\)/);
});
test('all transaction pages are loaded, including over 1000 entries',async()=>{
 const {run,context}=core();let ranges=[];
 context.fakeFrom=()=>{const q={select(){return q},order(){return q},async range(start,end){ranges.push([start,end]);return {data:Array.from({length:start<1000?500:20},(_,i)=>({id:start+i}))}}};return q};
 run('sb.from=fakeFrom');const result=await run('carregarGastos()');assert.equal(result.data.length,1020);assert.deepEqual(ranges,[[0,499],[500,999],[1000,1499]]);
});
function worker(){
 const listeners={},entries=new Map(),scope='https://example.test/app/';let fetches=0;
 const key=x=>typeof x==='string'?x:x.url;
 const cache={async addAll(items){items.forEach(x=>entries.set(new URL(x,scope).href,new Response(x)))},async match(x){return entries.get(new URL(key(x),scope).href)?.clone()},async put(x,value){entries.set(new URL(key(x),scope).href,value)}};
 const context={URL,Response,Set,console,fetch:async()=>{fetches++;return new Response('network')},caches:{async open(){return cache},async keys(){return ['unrelated-cache']},async delete(){throw Error('must not delete unrelated cache')}},self:{registration:{scope},location:{origin:'https://example.test'},skipWaiting:async()=>{},clients:{claim:async()=>{}},addEventListener:(name,fn)=>listeners[name]=fn}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),context);
 return {context,listeners,cache,fetches:()=>fetches,scope};
}
test('worker precaches existing local assets and reuses them without network',async()=>{
 const w=worker();let installed;w.listeners.install({waitUntil(p){installed=p}});await installed;
 const assets=vm.runInContext('ASSETS',w.context);for(const asset of assets){assert.ok(fs.existsSync(path.join(root,asset.split('?')[0])))}
 let response;w.listeners.fetch({request:{method:'GET',url:w.scope+'app-core.js?v=58'},respondWith(p){response=p}});assert.ok((await response).ok);assert.equal(w.fetches(),0);
});
test('worker excludes authenticated API requests and supports offline navigation',async()=>{
 const w=worker();let intercepted=false;
 w.listeners.fetch({request:{method:'GET',url:'https://project.supabase.co/rest/v1/gastos'},respondWith(){intercepted=true}});assert.equal(intercepted,false);
 await w.cache.put('./index.html',new Response('cached shell'));w.context.fetch=async()=>{throw Error('offline')};
 let response;w.listeners.fetch({request:{method:'GET',mode:'navigate',url:w.scope},respondWith(p){response=p}});assert.equal(await(await response).text(),'cached shell');
 let activated;w.listeners.activate({waitUntil(p){activated=p}});await activated;
});
test('recurring transaction keys are stable across retries and isolated by user/month',async()=>{
 const src=fs.readFileSync(path.join(root,'app-v50.js'),'utf8');
 const fn=src.slice(src.indexOf('  async function recurringId('),src.indexOf('  async function processRecurring('));
 const ctx=vm.createContext({crypto:require('node:crypto').webcrypto,TextEncoder,Uint8Array});vm.runInContext(fn,ctx);
 const key=await vm.runInContext("recurringId('user-a','rent','2026-09')",ctx);
 assert.equal(await vm.runInContext("recurringId('user-a','rent','2026-09')",ctx),key);
 assert.notEqual(await vm.runInContext("recurringId('user-b','rent','2026-09')",ctx),key);
 assert.notEqual(await vm.runInContext("recurringId('user-a','rent','2026-10')",ctx),key);
 assert.match(key,/^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
});
