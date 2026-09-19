const baseScripts=[{id:1,title:"Blox Fruits — Universal Hub",game:"Blox Fruits",tags:["Universal","Farm","PvP"],author:"ScriptMaster",views:18420,likes:932,verified:true,desc:"Blox Fruits için topluluk tarafından paylaşılan yardımcı script koleksiyonu.",code:"-- ScriptDepo demo\nprint('Blox Fruits script')"},{id:2,title:"MM2 Utility Pack",game:"MM2",tags:["MM2","Utility"],author:"VoidDev",views:12100,likes:701,verified:true,desc:"MM2 için çeşitli utility özelliklerini tek yerde toplar.",code:"-- ScriptDepo demo\nprint('MM2 utility')"},{id:3,title:"Universal ESP Toolkit",game:"Universal",tags:["Universal","ESP"],author:"Nova",views:9800,likes:540,verified:false,desc:"Uyumlu deneyimlerde görsel yardımcı özellikler için topluluk paylaşımı.",code:"-- ScriptDepo demo\nprint('Universal toolkit')"},{id:4,title:"Brookhaven Tools",game:"Brookhaven",tags:["Brookhaven","Fun"],author:"PixelDev",views:7300,likes:420,verified:false,desc:"Brookhaven topluluğundan araç ve eğlence odaklı paylaşım.",code:"-- ScriptDepo demo\nprint('Brookhaven tools')"},{id:5,title:"Blade Ball Helper",game:"Blade Ball",tags:["Blade Ball","Utility"],author:"Rex",views:6500,likes:318,verified:true,desc:"Blade Ball için topluluk tarafından gönderilmiş yardımcı script.",code:"-- ScriptDepo demo\nprint('Blade Ball helper')"},{id:6,title:"Adopt Me Toolkit",game:"Adopt Me",tags:["Adopt Me","Tools"],author:"Mira",views:4900,likes:205,verified:false,desc:"Adopt Me topluluğundan araç koleksiyonu.",code:"-- ScriptDepo demo\nprint('Adopt Me toolkit')"}];
let scripts=JSON.parse(localStorage.getItem("scriptdepo-scripts")||"null")||baseScripts.slice();let sort="popular",filter="";
function render(){let q=(document.getElementById("search")?.value||"").toLowerCase();let list=scripts.filter(s=>(!filter||s.game===filter||s.tags.includes(filter))&&(!q||[s.title,s.game,s.author,s.desc,...s.tags].join(" ").toLowerCase().includes(q)));if(sort==="new")list=[...list].reverse();if(sort==="views")list.sort((a,b)=>b.views-a.views);if(sort==="popular")list.sort((a,b)=>b.likes-a.likes);document.getElementById("grid").innerHTML=list.map(card).join("")||'<div class="card"><h3>Sonuç bulunamadı</h3><p class="desc">Başka bir oyun veya etiket deneyin.</p></div>'}
function card(s){return '<article class="card"><div class="card-top"><div class="icon">⚡</div><span class="verified">'+(s.verified?"✓ Doğrulandı":"")+'</span></div><h3>'+esc(s.title)+'</h3><p class="desc">'+esc(s.desc)+'</p><div class="meta"><span class="tag">'+esc(s.game)+'</span>'+s.tags.slice(0,3).map(t=>'<span class="tag">#'+esc(t)+'</span>').join("")+'</div><div class="card-foot"><span>👁 '+fmt(s.views)+' · ♥ '+fmt(s.likes)+'</span><button onclick="openScript('+s.id+')">Detay →</button></div></article>'}
function openScript(id){const s=scripts.find(x=>x.id===id);if(!s)return;document.getElementById("modalBox").innerHTML='<button class="close" onclick="hideModal()">×</button><span class="eyebrow">'+esc(s.game)+'</span><h2>'+esc(s.title)+'</h2><p class="desc">'+esc(s.desc)+'</p><p>👤 '+esc(s.author)+' · 👁 '+fmt(s.views)+' · ♥ '+fmt(s.likes)+'</p><div class="meta">'+s.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join("")+'</div><pre class="code">'+esc(s.code)+'</pre><button class="primary" onclick="copyScript('+s.id+')">Kodu Kopyala</button>';document.getElementById("modal").classList.add("show")}
function copyScript(id){const s=scripts.find(x=>x.id===id);navigator.clipboard?.writeText(s.code).then(()=>alert("Script kopyalandı!"))}
function hideModal(){document.getElementById("modal").classList.remove("show")}function closeModal(e){if(e.target.id==="modal")hideModal()}
function setFilter(x){filter=x;document.getElementById("search").value=x;document.getElementById("scripts").scrollIntoView({behavior:"smooth"});render()}
function setSort(x,b){sort=x;document.querySelectorAll(".filters button").forEach(y=>y.classList.remove("active"));b.classList.add("active");render()}
function publish(e){e.preventDefault();let s={id:Date.now(),title:pTitle.value,game:pGame.value,tags:pTags.value.split(",").map(x=>x.trim()).filter(Boolean),author:"Sen",views:0,likes:0,verified:false,desc:"Topluluk tarafından yeni gönderildi.",code:pCode.value};scripts.unshift(s);localStorage.setItem("scriptdepo-scripts",JSON.stringify(scripts));e.target.reset();render();alert("Script başarıyla yerel demoya eklendi!")}
function toggleTheme(){document.body.classList.toggle("light")}function fmt(n){return n>=1000?(n/1000).toFixed(1)+"K":n}function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}render();
const SUPABASE_URL = "https://jjwqdvjtcorzpvxlfnog.supabase.co";
const SUPABASE_KEY = "sb_publishable_J4NQfjyOIj_sMUA53iSnVA_inPdNLZ7";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = null, authMode = "login";

async function initScriptDepo(){
  const session = await supabaseClient.auth.getSession();
  currentUser = session.data.session?.user || null;
  updateAuthUI();
  await loadScriptsFromDB();
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
  });
}
async function loadScriptsFromDB(){
  const r = await supabaseClient.from("scripts").select("*").order("likes",{ascending:false});
  if(r.error) return render();
  scripts = r.data.map(s => ({id:s.id,title:s.title,game:s.game_name,tags:s.tags||[],author:s.author_id,views:s.views||0,likes:s.likes||0,verified:s.status==="approved",desc:s.description||"",code:s.script_content||s.source_url||""}));
  render();
}
function updateAuthUI(){
  const b=document.getElementById("adminBtn");
  if(b) b.classList.toggle("hidden", currentUser?.email?.toLowerCase() !== "mm2ultimatehub@gmail.com");
}
function openAuth(){document.getElementById("auth").classList.add("show")}
function hideAuth(){document.getElementById("auth").classList.remove("show")}
function toggleAuthMode(){
  authMode=authMode==="login"?"signup":"login";
  document.getElementById("authTitle").textContent=authMode==="login"?"Giriş yap":"Kayıt ol";
  document.getElementById("authSubmit").textContent=authMode==="login"?"Giriş Yap":"Kayıt Ol";
  document.getElementById("authName").classList.toggle("hidden",authMode==="login");
}
async function submitAuth(e){
  e.preventDefault();
  const r=authMode==="login"
    ? await supabaseClient.auth.signInWithPassword({email:authEmail.value,password:authPassword.value})
    : await supabaseClient.auth.signUp({email:authEmail.value,password:authPassword.value,options:{data:{display_name:authName.value}}});
  authStatus.textContent=r.error?r.error.message:(authMode==="login"?"Giriş başarılı!":"Kayıt başarılı. E-postanı doğrula.");
  if(!r.error && authMode==="login") hideAuth();
}
async function publish(e){
  e.preventDefault();
  if(!currentUser) return openAuth();
  const r=await supabaseClient.from("scripts").insert({
    title:pTitle.value,
    slug:pTitle.value.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now(),
    game_name:pGame.value,
    tags:pTags.value.split(",").map(x=>x.trim()).filter(Boolean),
    description:"Topluluk tarafından yeni gönderildi.",
    script_content:pCode.value,
    author_id:currentUser.id,
    status:"pending"
  });
  if(r.error) return alert(r.error.message);
  e.target.reset();
  await loadScriptsFromDB();
  alert("Script gönderildi. Admin onayından sonra yayınlanacak.");
}
async function openAdmin(){
  if(currentUser?.email?.toLowerCase()!=="mm2ultimatehub@gmail.com") return;
  document.getElementById("admin").classList.add("show");
  const r=await supabaseClient.from("scripts").select("*").order("created_at",{ascending:false});
  if(r.error) return adminContent.textContent=r.error.message;
  adminContent.innerHTML=(r.data||[]).map(s=>'<div class="admin-row"><div><b>'+esc(s.title)+'</b><div class="status">'+esc(s.status)+' · '+esc(s.game_name)+'</div></div>'+(s.status==="pending"?'<button class="primary" onclick="approveScript(\''+s.id+'\')">Onayla</button>':'')+'</div>').join("")||"Script yok.";
}
function hideAdmin(){document.getElementById("admin").classList.remove("show")}
async function approveScript(id){await supabaseClient.from("scripts").update({status:"approved"}).eq("id",id);await openAdmin();await loadScriptsFromDB()}
initScriptDepo();
