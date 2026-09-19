const SUPABASE_URL="https://jjwqdvjtcorzpvxlfnog.supabase.co";
const SUPABASE_KEY="sb_publishable_J4NQfjyOIj_sMUA53iSnVA_inPdNLZ7";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const demoScripts=[
{id:"demo-1",title:"Blox Fruits — Universal Hub",game:"Blox Fruits",tags:["Universal","Farm","PvP"],author:"ScriptDepo",views:18420,likes:932,verified:true,desc:"Blox Fruits için topluluk tarafından paylaşılan yardımcı script koleksiyonu.",code:"-- ScriptDepo demo\nprint('Blox Fruits script')"},
{id:"demo-2",title:"MM2 Utility Pack",game:"MM2",tags:["MM2","Utility"],author:"ScriptDepo",views:12100,likes:701,verified:true,desc:"MM2 için çeşitli utility özelliklerini tek yerde toplar.",code:"-- ScriptDepo demo\nprint('MM2 utility')"},
{id:"demo-3",title:"Universal ESP Toolkit",game:"Universal",tags:["Universal","ESP"],author:"ScriptDepo",views:9800,likes:540,verified:false,desc:"Uyumlu deneyimlerde görsel yardımcı özellikler için topluluk paylaşımı.",code:"-- ScriptDepo demo\nprint('Universal toolkit')"},
{id:"demo-4",title:"Brookhaven Tools",game:"Brookhaven",tags:["Brookhaven","Fun"],author:"ScriptDepo",views:7300,likes:420,verified:false,desc:"Brookhaven topluluğundan araç ve eğlence odaklı paylaşım.",code:"-- ScriptDepo demo\nprint('Brookhaven tools')"},
{id:"demo-5",title:"Blade Ball Helper",game:"Blade Ball",tags:["Blade Ball","Utility"],author:"ScriptDepo",views:6500,likes:318,verified:true,desc:"Blade Ball için topluluk tarafından gönderilmiş yardımcı script.",code:"-- ScriptDepo demo\nprint('Blade Ball helper')"},
{id:"demo-6",title:"Adopt Me Toolkit",game:"Adopt Me",tags:["Adopt Me","Tools"],author:"ScriptDepo",views:4900,likes:205,verified:false,desc:"Adopt Me topluluğundan araç koleksiyonu.",code:"-- ScriptDepo demo\nprint('Adopt Me toolkit')"}
];

let scripts=[...demoScripts],sort="popular",filter="",user=null,profile=null,authMode="login";

const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmt=n=>n>=1000?(n/1000).toFixed(1)+"K":n;

function render(){
  const q=(search.value||"").toLowerCase();
  let list=scripts.filter(s=>(!filter||s.game===filter||s.tags.includes(filter))&&(!q||[s.title,s.game,s.author,s.desc,...s.tags].join(" ").toLowerCase().includes(q)));
  if(sort==="new")list=[...list].reverse();
  if(sort==="views")list.sort((a,b)=>b.views-a.views);
  if(sort==="popular")list.sort((a,b)=>b.likes-a.likes);
  grid.innerHTML=list.map(card).join("")||'<div class="card"><h3>Sonuç bulunamadı</h3><p class="desc">Başka bir oyun veya etiket deneyin.</p></div>';
  statScripts.textContent=list.length;
  statViews.textContent=fmt(list.reduce((a,s)=>a+s.views,0));
}

function card(s){
 return '<article class="card"><div class="card-top"><div class="icon">⚡</div><span class="verified">'+(s.verified?"✓ Doğrulandı":"")+'</span></div><h3>'+esc(s.title)+'</h3><p class="desc">'+esc(s.desc)+'</p><div class="meta"><span class="tag">'+esc(s.game)+'</span>'+s.tags.slice(0,3).map(t=>'<span class="tag">#'+esc(t)+'</span>').join("")+'</div><div class="card-foot"><span>👁 '+fmt(s.views)+' · ♥ '+fmt(s.likes)+'</span><button onclick="openScript(\''+s.id+'\')">Detay →</button></div></article>';
}

async function openScript(id){
 let s=scripts.find(x=>String(x.id)===String(id)); if(!s)return;
 let comments=[],liked=false,fav=false;
 if(!String(id).startsWith("demo-")){
   const [cr,lr,fr]=await Promise.all([
     db.from("comments").select("body,created_at").eq("script_id",id).order("created_at",{ascending:false}),
     user?db.from("script_likes").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle():Promise.resolve({data:null}),
     user?db.from("favorites").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle():Promise.resolve({data:null})
   ]);
   comments=cr.data||[]; liked=!!lr.data; fav=!!fr.data;
 }
 modalBox.innerHTML='<button class="close" onclick="hideModal()">×</button><span class="eyebrow">'+esc(s.game)+'</span><h2>'+esc(s.title)+'</h2><p class="desc">'+esc(s.desc)+'</p><p>👤 '+esc(s.author==="ScriptDepo"?"ScriptDepo":"Topluluk üyesi")+' · 👁 '+fmt(s.views)+' · ♥ '+fmt(s.likes)+'</p><div class="meta">'+s.tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join("")+'</div><pre class="code">'+esc(s.code)+'</pre><div class="detail-actions"><button class="primary" onclick="copyScript(\''+s.id+'\')">Kodu Kopyala</button>'+(!String(id).startsWith("demo-")?'<button class="ghost" onclick="likeScript(\''+s.id+'\')">'+(liked?"♥ Beğenildi":"♡ Beğen")+'</button><button class="ghost" onclick="favoriteScript(\''+s.id+'\')">'+(fav?"★ Favorilerde":"☆ Favori")+'</button><button class="ghost danger-btn" onclick="reportScript(\''+s.id+'\')">⚑ Rapor</button>':'')+'</div><div class="comments"><h3>Yorumlar <span class="muted-count">'+comments.length+'</span></h3>'+comments.map(c=>'<div class="comment"><b>Topluluk üyesi</b><p>'+esc(c.body)+'</p></div>').join("")+'<textarea id="commentText" maxlength="2000" placeholder="Yorumunu yaz..."></textarea><button class="primary" onclick="addComment(\''+s.id+'\')">Yorum gönder</button></div>';
 modal.classList.add("show");
}

function copyScript(id){
 const s=scripts.find(x=>String(x.id)===String(id)); if(!s)return;
 navigator.clipboard?.writeText(s.code).then(()=>alert("Script kopyalandı!"));
}
function hideModal(){modal.classList.remove("show")}
function closeModal(e){if(e.target.id==="modal")hideModal()}
function setFilter(x){filter=x;search.value=x;document.getElementById("scripts").scrollIntoView({behavior:"smooth"});render()}
function setSort(x,b){sort=x;document.querySelectorAll(".filters button").forEach(y=>y.classList.remove("active"));b.classList.add("active");render()}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("scriptdepo-theme",document.body.classList.contains("light")?"light":"dark")}

function openAuth(){auth.classList.add("show")}
function hideAuth(){auth.classList.remove("show")}
function toggleAuthMode(){
 authMode=authMode==="login"?"signup":"login";
 authTitle.textContent=authMode==="login"?"Giriş yap":"Kayıt ol";
 authSubmit.textContent=authMode==="login"?"Giriş Yap":"Kayıt Ol";
 authName.classList.toggle("hidden",authMode==="login");
}
async function submitAuth(e){
 e.preventDefault();
 const r=authMode==="login"
   ?await db.auth.signInWithPassword({email:authEmail.value,password:authPassword.value})
   :await db.auth.signUp({email:authEmail.value,password:authPassword.value,options:{data:{display_name:authName.value}}});
 authStatus.textContent=r.error?r.error.message:(authMode==="login"?"Giriş başarılı!":"Kayıt başarılı. E-postanı doğrula.");
 if(!r.error&&authMode==="login"){hideAuth();await refreshUser()}
}

async function refreshUser(){
 const s=await db.auth.getSession(); user=s.data.session?.user||null;
 if(user){
   const p=await db.from("profiles").select("id,email,display_name,role").eq("id",user.id).maybeSingle();
   profile=p.data||{id:user.id,email:user.email,display_name:user.email?.split("@")[0],role:"user"};
 }else profile=null;
 updateUser();
}

async function publish(e){
 e.preventDefault();
 if(!user)return openAuth();
 const title=pTitle.value.trim(),game=pGame.value.trim(),tags=pTags.value.split(",").map(x=>x.trim()).filter(Boolean),code=pCode.value.trim();
 const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now();
 const r=await db.from("scripts").insert({title,slug,game_name:game,tags,description:"Topluluk tarafından gönderildi.",script_content:code,author_id:user.id,status:"pending",visibility:"public"});
 if(r.error)return alert(r.error.message);
 e.target.reset();await loadDB();alert("Script gönderildi. Admin onayından sonra yayınlanacak.");
}

async function likeScript(id){
 if(!user)return openAuth();
 const existing=await db.from("script_likes").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle();
 const r=existing.data?await db.from("script_likes").delete().eq("script_id",id).eq("user_id",user.id):await db.from("script_likes").insert({script_id:id,user_id:user.id});
 if(r.error)return alert(r.error.message);
 await loadDB();openScript(id);
}

async function favoriteScript(id){
 if(!user)return openAuth();
 const existing=await db.from("favorites").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle();
 const r=existing.data?await db.from("favorites").delete().eq("script_id",id).eq("user_id",user.id):await db.from("favorites").insert({script_id:id,user_id:user.id});
 if(r.error)return alert(r.error.message);
 openScript(id);
}

async function addComment(id){
 if(!user)return openAuth();
 const el=document.getElementById("commentText"),body=el.value.trim(); if(!body)return;
 const r=await db.from("comments").insert({script_id:id,user_id:user.id,body});
 if(r.error)return alert(r.error.message); openScript(id);
}

async function reportScript(id){
 if(!user)return openAuth();
 const reason=prompt("Rapor nedeni?\nÖrn: Çalışmıyor, spam, uygunsuz içerik");
 if(!reason?.trim())return;
 const details=prompt("Ek açıklama (opsiyonel):")||"";
 const r=await db.from("reports").insert({script_id:id,reporter_id:user.id,reason:reason.trim().slice(0,200),details:details.slice(0,1000)});
 if(r.error)return alert(r.error.message);
 alert("Raporun admin ekibine iletildi.");
}

async function loadDB(){
 const r=await db.from("scripts").select("*").order("created_at",{ascending:false});
 if(!r.error&&r.data?.length)scripts=r.data.map(s=>({id:s.id,title:s.title,game:s.game_name,tags:s.tags||[],author:s.author_id,views:s.views||0,likes:s.likes||0,verified:s.status==="approved",desc:s.description||"",code:s.script_content||s.source_url||""}));
 else scripts=[...demoScripts];
 render();
}

function updateUser(){
 const name=profile?.display_name||user?.email||"Giriş / Kayıt";
 userBtn.textContent=user?name:"Giriş / Kayıt";
 userBtn.onclick=user?openProfile:openAuth;
 userBtn.classList.toggle("logged",!!user);
 adminBtn.classList.toggle("hidden",profile?.role!=="admin"&&profile?.role!=="moderator");
 myBtn.classList.toggle("hidden",!user);
}
async function openProfile(){
 if(!user)return openAuth();
 const p=await db.from("profiles").select("display_name,email,role").eq("id",user.id).maybeSingle();
 profile=p.data||profile; 
 profileName.value=profile?.display_name||"";
 profileEmail.value=profile?.email||user.email||"";
 profileRole.textContent=(profile?.role||"user").toUpperCase();
 profileModal.classList.add("show");
}
function hideProfile(){profileModal.classList.remove("show")}
async function saveProfile(e){
 e.preventDefault(); if(!user)return;
 const name=profileName.value.trim().slice(0,60); if(!name)return;
 const r=await db.from("profiles").update({display_name:name,updated_at:new Date().toISOString()}).eq("id",user.id);
 if(r.error)return alert(r.error.message);
 await refreshUser();hideProfile();alert("Profil güncellendi.");
}

async function openMy(){
 if(!user)return openAuth();
 myModal.classList.add("show"); myContent.innerHTML='<div class="loading">Yükleniyor...</div>';
 const [mine,favs]=await Promise.all([
  db.from("scripts").select("*").eq("author_id",user.id).order("created_at",{ascending:false}),
  db.from("favorites").select("script_id,created_at").eq("user_id",user.id).order("created_at",{ascending:false})
 ]);
 const favIds=(favs.data||[]).map(x=>x.script_id);
 const favScripts=favIds.length?(await db.from("scripts").select("*").in("id",favIds)).data||[]:[];
 myContent.innerHTML='<div class="dash-grid"><div><h3>Scriptlerim <span class="muted-count">'+(mine.data||[]).length+'</span></h3>'+((mine.data||[]).map(s=>dashboardRow(s,"mine")).join("")||'<p class="muted">Henüz script göndermedin.</p>')+'</div><div><h3>Favoriler <span class="muted-count">'+favScripts.length+'</span></h3>'+favScripts.map(s=>dashboardRow(s,"fav")).join("")||'<p class="muted">Henüz favorin yok.</p>'+'</div></div>';
}
function dashboardRow(s,type){
 return '<div class="dash-row"><div><b>'+esc(s.title)+'</b><span>'+esc(s.game_name)+' · '+esc(s.status)+'</span></div><div><button class="ghost" onclick="openScript(\''+s.id+'\');hideMy()">Aç</button>'+(type==="mine"&&s.status!=="approved"?'<button class="ghost danger-btn" onclick="deleteMine(\''+s.id+'\')">Sil</button>':'')+'</div></div>';
}
function hideMy(){myModal.classList.remove("show")}
async function deleteMine(id){
 if(!confirm("Bu script silinsin mi?"))return;
 const r=await db.from("scripts").delete().eq("id",id).eq("author_id",user.id);
 if(r.error)alert(r.error.message); else openMy();
}

async function openAdmin(){
 if(!user||!["admin","moderator"].includes(profile?.role))return;
 admin.classList.add("show");await renderAdmin("scripts");
}
function hideAdmin(){admin.classList.remove("show")}
async function renderAdmin(tab){
 adminContent.innerHTML='<div class="loading">Yükleniyor...</div>';
 if(tab==="scripts"){
   const r=await db.from("scripts").select("*").order("created_at",{ascending:false});
   if(r.error)return adminContent.textContent=r.error.message;
   adminContent.innerHTML=(r.data||[]).map(s=>'<div class="admin-row"><div><b>'+esc(s.title)+'</b><div class="status">'+esc(s.status)+' · '+esc(s.game_name)+'</div></div><div>'+(s.status==="pending"?'<button class="primary" onclick="approve(\''+s.id+'\')">Onayla</button> ':'')+'<button class="ghost danger-btn" onclick="removeScript(\''+s.id+'\')">Sil</button></div></div>').join("")||"Script yok.";
 }else if(tab==="reports"){
   const r=await db.from("reports").select("id,script_id,reason,details,status,created_at").order("created_at",{ascending:false});
   if(r.error)return adminContent.textContent=r.error.message;
   adminContent.innerHTML=(r.data||[]).map(x=>'<div class="admin-row"><div><b>'+esc(x.reason)+'</b><div class="status">'+esc(x.status)+' · '+esc(x.details||"")+'</div></div><button class="ghost" onclick="resolveReport(\''+x.id+'\')">Çözüldü</button></div>').join("")||"Rapor yok.";
 }else{
   const r=await db.from("profiles").select("id,email,display_name,role").order("created_at",{ascending:false});
   if(r.error)return adminContent.textContent=r.error.message;
   adminContent.innerHTML=(r.data||[]).map(p=>'<div class="admin-row"><div><b>'+esc(p.display_name||"İsimsiz")+'</b><div class="status">'+esc(p.email)+' · '+esc(p.role)+'</div></div><select onchange="changeRole(\''+p.id+'\',this.value)"><option value="user" '+(p.role==="user"?"selected":"")+'>user</option><option value="moderator" '+(p.role==="moderator"?"selected":"")+'>moderator</option><option value="admin" '+(p.role==="admin"?"selected":"")+'>admin</option></select></div>').join("");
 }
}
async function approve(id){const r=await db.from("scripts").update({status:"approved",updated_at:new Date().toISOString()}).eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("scripts");await loadDB()}
async function removeScript(id){if(!confirm("Script silinsin mi?"))return;const r=await db.from("scripts").delete().eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("scripts");await loadDB()}
async function resolveReport(id){const r=await db.from("reports").update({status:"resolved"}).eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("reports")}
async function changeRole(id,role){const r=await db.from("profiles").update({role,updated_at:new Date().toISOString()}).eq("id",id);if(r.error){alert(r.error.message);await renderAdmin("users")}}

function logout(){db.auth.signOut().then(()=>{user=null;profile=null;updateUser();hideProfile();hideMy();})}

async function boot(){
 if(localStorage.getItem("scriptdepo-theme")==="light")document.body.classList.add("light");
 await refreshUser(); await loadDB();
 db.auth.onAuthStateChange(async()=>{setTimeout(refreshUser,0)});
}
boot();
