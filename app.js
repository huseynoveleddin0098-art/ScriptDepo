const SUPABASE_URL="https://jjwqdvjtcorzpvxlfnog.supabase.co";
const SUPABASE_KEY="sb_publishable_J4NQfjyOIj_sMUA53iSnVA_inPdNLZ7";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const demoScripts=[
{id:"demo-1",title:"Blox Fruits — Universal Hub",game:"Blox Fruits",tags:["Universal","Farm","PvP"],author:"ScriptDepo",views:18420,likes:932,verified:true,desc:"Blox Fruits için topluluk tarafından paylaşılan yardımcı script koleksiyonu.",code:"-- ScriptDepo demo\nprint('Blox Fruits script')"},
{id:"demo-2",title:"MM2 Utility Pack",game:"MM2",tags:["MM2","Utility","Mobile"],author:"ScriptDepo",views:12100,likes:701,verified:true,desc:"MM2 için çeşitli utility özelliklerini tek yerde toplar.",code:"-- ScriptDepo demo\nprint('MM2 utility')"},
{id:"demo-3",title:"Universal ESP Toolkit",game:"Universal",tags:["Universal","ESP","Open Source"],author:"ScriptDepo",views:9800,likes:540,verified:false,desc:"Uyumlu deneyimlerde görsel yardımcı özellikler için topluluk paylaşımı.",code:"-- ScriptDepo demo\nprint('Universal toolkit')"},
{id:"demo-4",title:"Brookhaven Tools",game:"Brookhaven",tags:["Brookhaven","Fun","Mobile"],author:"ScriptDepo",views:7300,likes:420,verified:false,desc:"Brookhaven topluluğundan araç ve eğlence odaklı paylaşım.",code:"-- ScriptDepo demo\nprint('Brookhaven tools')"},
{id:"demo-5",title:"Blade Ball Helper",game:"Blade Ball",tags:["Blade Ball","Utility","Keyless"],author:"ScriptDepo",views:6500,likes:318,verified:true,desc:"Blade Ball için topluluk tarafından gönderilmiş yardımcı script.",code:"-- ScriptDepo demo\nprint('Blade Ball helper')"},
{id:"demo-6",title:"Adopt Me Toolkit",game:"Adopt Me",tags:["Adopt Me","Tools","Mobile"],author:"ScriptDepo",views:4900,likes:205,verified:false,desc:"Adopt Me topluluğundan araç koleksiyonu.",code:"-- ScriptDepo demo\nprint('Adopt Me toolkit')"},
{id:"demo-7",title:"Blox Fruits Farm Assistant",game:"Blox Fruits",tags:["Farm","Level","Keyless"],author:"ScriptDepo",views:15400,likes:812,verified:true,desc:"Farm odaklı topluluk paylaşımı.",code:"-- ScriptDepo demo\nprint('Farm assistant')"},
{id:"demo-8",title:"MM2 Visual Pack",game:"MM2",tags:["ESP","Visual","Mobile"],author:"ScriptDepo",views:8900,likes:477,verified:true,desc:"MM2 için görsel yardımcı araçlar.",code:"-- ScriptDepo demo\nprint('Visual pack')"}
];

let scripts=[...demoScripts],sort="new",gameFilter="",tagFilter="",user=null,profile=null,authMode="login";

const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const fmt=n=>Number(n)>=1000000?(Number(n)/1000000).toFixed(1)+"M":Number(n)>=1000?(Number(n)/1000).toFixed(1)+"K":String(n||0);
const ago=d=>{if(!d)return "yeni";const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<60)return m+" dk önce";const h=Math.floor(m/60);if(h<24)return h+" sa önce";const day=Math.floor(h/24);return day+" gün önce"};

function filtered(){
 const q=(document.getElementById("search")?.value||"").trim().toLowerCase();
 let list=scripts.filter(s=>
   (!gameFilter||s.game===gameFilter)&&(!tagFilter||s.tags.includes(tagFilter))&&
   (!q||[s.title,s.game,s.author,s.desc,...s.tags].join(" ").toLowerCase().includes(q))
 );
 if(sort==="popular")list.sort((a,b)=>b.likes-a.likes);
 else if(sort==="views")list.sort((a,b)=>b.views-a.views);
 else list.sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
 return list;
}

function render(){
 const list=filtered();
 const grid=document.getElementById("grid");
 grid.innerHTML=list.length?list.map(card).join(""):'<div class="empty-card"><b>Sonuç bulunamadı</b><span>Arama veya filtrelerini değiştirmeyi dene.</span></div>';
 const games=[...new Set(scripts.map(s=>s.game).filter(Boolean))];
 const tags=[...new Set(scripts.flatMap(s=>s.tags||[]).filter(Boolean))];
 const gf=document.getElementById("gameFilter"),tf=document.getElementById("tagFilter");
 if(gf)gf.innerHTML='<option value="">Tüm oyunlar</option>'+games.map(x=>'<option '+(x===gameFilter?"selected":"")+'>'+esc(x)+'</option>').join("");
 if(tf)tf.innerHTML='<option value="">Tüm özellikler</option>'+tags.map(x=>'<option '+(x===tagFilter?"selected":"")+'>'+esc(x)+'</option>').join("");
 const gamesCount=games.length;
 document.getElementById("statScripts").textContent=scripts.length;
 document.getElementById("statGames").textContent=gamesCount;
 document.getElementById("statViews").textContent=fmt(scripts.reduce((a,s)=>a+Number(s.views||0),0));
 document.getElementById("statLikes").textContent=fmt(scripts.reduce((a,s)=>a+Number(s.likes||0),0));
 renderSections();
}

function card(s,compact=false){
 const badge=s.verified?'<span class="badge verified">✓ Verified</span>':'<span class="badge">Community</span>';
 const tags=(s.tags||[]).slice(0,3).map(t=>'<span class="tag">#'+esc(t)+'</span>').join("");
 return '<article class="card '+(compact?"compact":"")+'"><div class="cover"><div class="game-mark">'+gameIcon(s.game)+'</div><div class="cover-badges">'+badge+'</div></div><div class="card-body"><div class="card-game">'+esc(s.game||"Universal")+'</div><h3>'+esc(s.title)+'</h3><p class="desc">'+esc(s.desc)+'</p><div class="meta">'+tags+'</div><div class="card-foot"><span>👁 '+fmt(s.views)+' · ♥ '+fmt(s.likes)+'</span><span>'+esc(s.author==="ScriptDepo"?"ScriptDepo":"Topluluk")+'</span></div><button class="card-open" onclick="openScript(\''+s.id+'\')">Detayları gör →</button></div></article>';
}

function gameIcon(g){const x=(g||"").toLowerCase();if(x.includes("blox"))return"🍎";if(x.includes("murder")||x==="mm2")return"🔪";if(x.includes("brook"))return"🏙️";if(x.includes("blade"))return"⚔️";if(x.includes("adopt"))return"🐾";return"⚡"}

function renderSections(){
 const popular=[...scripts].sort((a,b)=>b.likes-a.likes).slice(0,4);
 const recommended=[...scripts].sort((a,b)=>(b.views+b.likes*8)-(a.views+a.likes*8)).slice(0,4);
 const liked=[...scripts].sort((a,b)=>b.likes-a.likes).slice(0,4);
 document.getElementById("trendingGrid").innerHTML=popular.map(s=>card(s,true)).join("");
 document.getElementById("recommendedGrid").innerHTML=recommended.map(s=>card(s,true)).join("");
 document.getElementById("likedGrid").innerHTML=liked.map(s=>card(s,true)).join("");
 const counts={};scripts.forEach(s=>counts[s.game]=(counts[s.game]||0)+1);
 document.getElementById("gameRow").innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([g,n])=>'<button onclick="setFilter(\''+esc(g).replace(/'/g,"\\'")+'\')"><b>'+gameIcon(g)+' '+esc(g)+'</b><small>'+n+' script'+(n===1?"":"ler")+'</small></button>').join("");
}

function setSort(x,b){sort=x;document.querySelectorAll(".filters button").forEach(y=>y.classList.remove("active"));if(b)b.classList.add("active");const t={new:"Newest",popular:"Popular",views:"Most Viewed"};document.getElementById("sectionTitle").textContent=t[x]||"Scripts";render();focusScripts()}
function filterByGame(v){gameFilter=v;tagFilter="";render()}
function filterByTag(v){tagFilter=v;gameFilter="";render()}
function setFilter(v){gameFilter=v;tagFilter="";const gf=document.getElementById("gameFilter");if(gf)gf.value=v;document.getElementById("search").value="";render();focusScripts()}
function clearFilters(){gameFilter="";tagFilter="";document.getElementById("search").value="";render()}
function focusScripts(){document.getElementById("scripts").scrollIntoView({behavior:"smooth",block:"start"})}
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("scriptdepo-theme",document.body.classList.contains("light")?"light":"dark")}

async function openScript(id){
 const s=scripts.find(x=>String(x.id)===String(id));if(!s)return;
 let comments=[],liked=false,fav=false;
 if(!String(id).startsWith("demo-")){
   const [cr,lr,fr]=await Promise.all([
    db.from("comments").select("body,created_at,user_id").eq("script_id",id).order("created_at",{ascending:false}),
    user?db.from("script_likes").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle():Promise.resolve({data:null}),
    user?db.from("favorites").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle():Promise.resolve({data:null})
   ]);
   comments=cr.data||[];liked=!!lr.data;fav=!!fr.data;
 }
 document.getElementById("modalBox").innerHTML='<button class="close" onclick="hideModal()">×</button><div class="detail-cover"><span>'+gameIcon(s.game)+'</span><small>'+esc(s.game)+'</small></div><span class="eyebrow">'+esc(s.game)+'</span><h2>'+esc(s.title)+'</h2><p class="desc">'+esc(s.desc)+'</p><div class="detail-stats"><span>👁 '+fmt(s.views)+'</span><span>♥ '+fmt(s.likes)+'</span><span>👤 '+esc(s.author==="ScriptDepo"?"ScriptDepo":"Topluluk üyesi")+'</span></div><div class="meta">'+(s.tags||[]).map(t=>'<span class="tag">#'+esc(t)+'</span>').join("")+'</div><pre class="code">'+esc(s.code||"Kaynak bağlantısı mevcut.")+'</pre><div class="detail-actions"><button class="primary" onclick="copyScript(\''+s.id+'\')">Kodu Kopyala</button>'+(!String(id).startsWith("demo-")?'<button class="ghost" onclick="likeScript(\''+s.id+'\')">'+(liked?"♥ Beğenildi":"♡ Beğen")+'</button><button class="ghost" onclick="favoriteScript(\''+s.id+'\')">'+(fav?"★ Favorilerde":"☆ Favori")+'</button><button class="ghost danger-btn" onclick="reportScript(\''+s.id+'\')">⚑ Rapor</button>':'')+'</div><div class="comments"><div class="comments-head"><h3>Yorumlar <span class="muted-count">'+comments.length+'</span></h3></div>'+comments.map(c=>'<div class="comment"><b>Topluluk üyesi</b><small>'+ago(c.created_at)+'</small><p>'+esc(c.body)+'</p></div>').join("")+'<textarea id="commentText" maxlength="2000" placeholder="Yorumunu yaz..."></textarea><button class="primary" onclick="addComment(\''+s.id+'\')">Yorum gönder</button></div>';
 document.getElementById("modal").classList.add("show");
}
function copyScript(id){const s=scripts.find(x=>String(x.id)===String(id));if(!s)return;navigator.clipboard?.writeText(s.code||"").then(()=>alert("Script kopyalandı!")).catch(()=>alert("Kopyalama desteklenmiyor."))}
function hideModal(){document.getElementById("modal").classList.remove("show")}
function closeModal(e){if(e.target.id==="modal")hideModal()}

function openAuth(){document.getElementById("auth").classList.add("show")}
function hideAuth(){document.getElementById("auth").classList.remove("show")}
function toggleAuthMode(){authMode=authMode==="login"?"signup":"login";authTitle.textContent=authMode==="login"?"Giriş yap":"Kayıt ol";authSubmit.textContent=authMode==="login"?"Giriş Yap":"Kayıt Ol";authName.classList.toggle("hidden",authMode==="login")}
async function submitAuth(e){e.preventDefault();const r=authMode==="login"?await db.auth.signInWithPassword({email:authEmail.value,password:authPassword.value}):await db.auth.signUp({email:authEmail.value,password:authPassword.value,options:{data:{display_name:authName.value.trim()}}});authStatus.textContent=r.error?r.error.message:(authMode==="login"?"Giriş başarılı!":"Kayıt başarılı. E-postanı doğrula.");if(!r.error&&authMode==="login"){hideAuth();await refreshUser()}}

async function refreshUser(){const s=await db.auth.getSession();user=s.data.session?.user||null;if(user){const p=await db.from("profiles").select("id,email,display_name,role").eq("id",user.id).maybeSingle();profile=p.data||{id:user.id,email:user.email,display_name:user.email?.split("@")[0],role:"user"}}else profile=null;updateUser()}
function updateUser(){userBtn.textContent=user?(profile?.display_name||user.email):"Giriş / Kayıt";userBtn.onclick=user?openProfile:openAuth;userBtn.classList.toggle("logged",!!user);adminBtn.classList.toggle("hidden",!["admin","moderator"].includes(profile?.role));myBtn.classList.toggle("hidden",!user)}

async function publish(e){
 e.preventDefault();if(!user)return openAuth();
 const title=pTitle.value.trim(),game=pGame.value.trim(),tags=pTags.value.split(",").map(x=>x.trim()).filter(Boolean),code=pCode.value.trim();
 const r=await db.from("scripts").insert({title,slug:title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now(),game_name:game,tags,description:pDesc.value.trim()||"Topluluk tarafından gönderildi.",script_content:code,source_url:pSource.value.trim()||null,author_id:user.id,status:"pending",visibility:"public"});
 if(r.error)return alert(r.error.message);e.target.reset();await loadDB();alert("Script gönderildi. Admin onayından sonra yayınlanacak.")
}
async function likeScript(id){if(!user)return openAuth();const q=await db.from("script_likes").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle();const r=q.data?await db.from("script_likes").delete().eq("script_id",id).eq("user_id",user.id):await db.from("script_likes").insert({script_id:id,user_id:user.id});if(r.error)return alert(r.error.message);await loadDB();openScript(id)}
async function favoriteScript(id){if(!user)return openAuth();const q=await db.from("favorites").select("script_id").eq("script_id",id).eq("user_id",user.id).maybeSingle();const r=q.data?await db.from("favorites").delete().eq("script_id",id).eq("user_id",user.id):await db.from("favorites").insert({script_id:id,user_id:user.id});if(r.error)return alert(r.error.message);openScript(id)}
async function addComment(id){if(!user)return openAuth();const el=document.getElementById("commentText"),body=el.value.trim();if(!body)return;const r=await db.from("comments").insert({script_id:id,user_id:user.id,body});if(r.error)return alert(r.error.message);openScript(id)}
async function reportScript(id){if(!user)return openAuth();const reason=prompt("Rapor nedeni?");if(!reason?.trim())return;const details=prompt("Ek açıklama (opsiyonel):")||"";const r=await db.from("reports").insert({script_id:id,reporter_id:user.id,reason:reason.trim().slice(0,200),details:details.slice(0,1000)});if(r.error)return alert(r.error.message);alert("Rapor admin ekibine iletildi.")}

async function loadDB(){const r=await db.from("scripts").select("*").eq("status","approved").eq("visibility","public").order("created_at",{ascending:false});if(!r.error&&r.data?.length)scripts=r.data.map(s=>({id:s.id,title:s.title,game:s.game_name,tags:s.tags||[],author:s.author_id,views:s.views||0,likes:s.likes||0,verified:true,desc:s.description||"",code:s.script_content||s.source_url||"",created_at:s.created_at}));else scripts=[...demoScripts];render()}

async function openProfile(){if(!user)return openAuth();const p=await db.from("profiles").select("display_name,email,role").eq("id",user.id).maybeSingle();profile=p.data||profile;profileName.value=profile?.display_name||"";profileEmail.value=profile?.email||user.email||"";profileRole.textContent=(profile?.role||"user").toUpperCase();profileModal.classList.add("show")}
function hideProfile(){profileModal.classList.remove("show")}
async function saveProfile(e){e.preventDefault();if(!user)return;const name=profileName.value.trim();if(!name)return;const r=await db.from("profiles").update({display_name:name,updated_at:new Date().toISOString()}).eq("id",user.id);if(r.error)return alert(r.error.message);await refreshUser();hideProfile();alert("Profil güncellendi.")}
async function openMy(){if(!user)return openAuth();myModal.classList.add("show");myContent.innerHTML='<div class="loading">Yükleniyor...</div>';const [mine,favs]=await Promise.all([db.from("scripts").select("*").eq("author_id",user.id).order("created_at",{ascending:false}),db.from("favorites").select("script_id").eq("user_id",user.id)]);const ids=(favs.data||[]).map(x=>x.script_id);const favScripts=ids.length?(await db.from("scripts").select("*").in("id",ids)).data||[]:[];myContent.innerHTML='<div class="dash-grid"><div><h3>Scriptlerim <span class="muted-count">'+(mine.data||[]).length+'</span></h3>'+((mine.data||[]).map(s=>dashboardRow(s,"mine")).join("")||'<p class="muted">Henüz script göndermedin.</p>')+'</div><div><h3>Favoriler <span class="muted-count">'+favScripts.length+'</span></h3>'+favScripts.map(s=>dashboardRow(s,"fav")).join("")||'<p class="muted">Henüz favorin yok.</p>'+'</div></div>'}
function dashboardRow(s,type){return '<div class="dash-row"><div><b>'+esc(s.title)+'</b><span>'+esc(s.game_name)+' · '+esc(s.status)+'</span></div><div><button class="ghost" onclick="openScript(\''+s.id+'\');hideMy()">Aç</button>'+(type==="mine"&&s.status!=="approved"?'<button class="ghost danger-btn" onclick="deleteMine(\''+s.id+'\')">Sil</button>':'')+'</div></div>'}
function hideMy(){myModal.classList.remove("show")}
async function deleteMine(id){if(!confirm("Bu script silinsin mi?"))return;const r=await db.from("scripts").delete().eq("id",id).eq("author_id",user.id);if(r.error)alert(r.error.message);else openMy()}

async function openAdmin(){if(!user||!["admin","moderator"].includes(profile?.role))return;admin.classList.add("show");renderAdmin("scripts")}
function hideAdmin(){admin.classList.remove("show")}
async function renderAdmin(tab){adminContent.innerHTML='<div class="loading">Yükleniyor...</div>';if(tab==="scripts"){const r=await db.from("scripts").select("*").order("created_at",{ascending:false});if(r.error)return adminContent.textContent=r.error.message;adminContent.innerHTML=(r.data||[]).map(s=>'<div class="admin-row"><div><b>'+esc(s.title)+'</b><div class="status">'+esc(s.status)+' · '+esc(s.game_name)+'</div></div><div>'+(s.status==="pending"?'<button class="primary" onclick="approve(\''+s.id+'\')">Onayla</button> ':'')+'<button class="ghost danger-btn" onclick="removeScript(\''+s.id+'\')">Sil</button></div></div>').join("")||"Script yok."}else if(tab==="reports"){const r=await db.from("reports").select("id,script_id,reason,details,status,created_at").order("created_at",{ascending:false});if(r.error)return adminContent.textContent=r.error.message;adminContent.innerHTML=(r.data||[]).map(x=>'<div class="admin-row"><div><b>'+esc(x.reason)+'</b><div class="status">'+esc(x.status)+' · '+esc(x.details||"")+'</div></div><button class="ghost" onclick="resolveReport(\''+x.id+'\')">Çözüldü</button></div>').join("")||"Rapor yok."}else{const r=await db.from("profiles").select("id,email,display_name,role").order("created_at",{ascending:false});if(r.error)return adminContent.textContent=r.error.message;adminContent.innerHTML=(r.data||[]).map(p=>'<div class="admin-row"><div><b>'+esc(p.display_name||"İsimsiz")+'</b><div class="status">'+esc(p.email)+' · '+esc(p.role)+'</div></div><select onchange="changeRole(\''+p.id+'\',this.value)"><option value="user" '+(p.role==="user"?"selected":"")+' >user</option><option value="moderator" '+(p.role==="moderator"?"selected":"")+' >moderator</option><option value="admin" '+(p.role==="admin"?"selected":"")+' >admin</option></select></div>').join("")}}
async function approve(id){const r=await db.from("scripts").update({status:"approved",updated_at:new Date().toISOString()}).eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("scripts");await loadDB()}
async function removeScript(id){if(!confirm("Script silinsin mi?"))return;const r=await db.from("scripts").delete().eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("scripts");await loadDB()}
async function resolveReport(id){const r=await db.from("reports").update({status:"resolved"}).eq("id",id);if(r.error)alert(r.error.message);await renderAdmin("reports")}
async function changeRole(id,role){const r=await db.from("profiles").update({role,updated_at:new Date().toISOString()}).eq("id",id);if(r.error)alert(r.error.message)}

function logout(){db.auth.signOut().then(()=>{user=null;profile=null;updateUser();hideProfile();hideMy()})}
async function boot(){if(localStorage.getItem("scriptdepo-theme")==="light")document.body.classList.add("light");await refreshUser();await loadDB();db.auth.onAuthStateChange(()=>setTimeout(refreshUser,0))}
boot();