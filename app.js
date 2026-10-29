const API='https://sjclznddmcjoxwfpxklv.supabase.co/functions/v1/tg-data';
const $=s=>document.querySelector(s);
const tg=window.Telegram&&Telegram.WebApp;
const T=f=>{try{f()}catch(e){}};
T(()=>tg.ready());T(()=>tg.expand());T(()=>tg.disableVerticalSwipes());
T(()=>tg.setBackgroundColor('#1c2e26'));T(()=>tg.setHeaderColor('#1c2e26'));
let ready=false,busy=false,lastErr='',lastInit=0,dirty=false,pt;
function norm(o){
 o=o||{};o.tasks=Array.isArray(o.tasks)?o.tasks:[];o.nick=o.nick||'';o.set=o.set||{c:1,v:1,g:1};
 if(o.set.g===undefined)o.set.g=1;o.since=o.since||Date.now();
 o.tasks.forEach(t=>{if(!t.st)t.st='a';if(!t.lp)t.lp=Date.now()});
 return o;
}
let S;try{S=JSON.parse(localStorage.getItem('s'))}catch(e){}
S=norm(S);
let page='home',tab=0,pos=0,bt,af='f',_f,editing,d=null,sw=null;
const RV=112;
const TR='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pct=t=>t.subs.length?Math.round(t.subs.filter(s=>s.d).length/t.subs.length*100):0;
const gt=id=>S.tasks.find(t=>t.id==id);
const tgNick=()=>{try{const u=tg.initDataUnsafe.user;return u.username||u.first_name||'Гость'}catch(e){return 'Гость'}};
const tgPhoto=()=>{try{return tg.initDataUnsafe.user.photo_url||''}catch(e){return ''}};
const hap=()=>T(()=>{if(S.set.v)tg.HapticFeedback.impactOccurred('light')});
const hapN=()=>T(()=>{if(S.set.v)tg.HapticFeedback.notificationOccurred('success')});

async function api(action,data){
 const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:(tg&&tg.initData)||'',action,data})});
 if(!r.ok){let m='';try{m=(await r.text()).slice(0,160)}catch(e){}throw new Error(r.status+' '+m)}
 return r.json();
}
function setSync(v){const e=$('#sync');if(e)e.textContent=v===1?'Подключено':v===0?'Нет связи':'Подключение…'}
async function init(){
 if(busy)return;busy=true;setSync(null);
 try{
  const r=await api('load'),srv=r.data;
  if(!srv){S.upd=S.upd||Date.now();await api('save',S)}
  else if(S.sy&&(S.upd||0)>(srv.upd||0)){await api('save',S);dirty=false}
  else if(!S.sy||(srv.upd||0)>(S.upd||0)){S=norm(srv)}
  S.sy=1;ready=true;lastErr='';setSync(1);
  T(()=>localStorage.setItem('s',JSON.stringify(S)));render();
 }catch(e){ready=false;lastErr=String(e&&e.message||e);setSync(0)}
 busy=false;
}
async function flush(){
 if(busy){pt=setTimeout(flush,1500);return}
 if(!ready){await init();return}
 try{await api('save',S);dirty=false;setSync(1)}catch(e){lastErr=String(e&&e.message||e);setSync(0)}
}
function push(){clearTimeout(pt);pt=setTimeout(flush,800)}
function save(){S.upd=Date.now();dirty=true;T(()=>localStorage.setItem('s',JSON.stringify(S)));render();push()}
function syncInfo(){modal(`<div>${esc(lastErr||'Данные сохраняются в облаке и доступны на всех ваших устройствах.')}</div><div class="btns"><button class="pill" onclick="closeM();init()">Обновить</button><button class="pill" onclick="closeM()">Понятно</button></div>`)}
async function delAcc(){
 try{await api('delete')}catch(e){modal('<div>Не удалось удалить аккаунт. Проверьте соединение и попробуйте ещё раз.</div><div class="btns"><button class="pill" onclick="closeM()">Понятно</button></div>');return}
 clearTimeout(pt);dirty=false;
 S=norm({tasks:[],nick:'',set:{c:1,v:1,g:1},since:Date.now()});S.upd=Date.now();
 T(()=>localStorage.setItem('s',JSON.stringify(S)));$('#nk').value='';render();go(0);
}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){clearTimeout(pt);if(ready&&dirty)api('save',S).then(()=>{dirty=false}).catch(()=>{})}
 else if(Date.now()-lastInit>5000){lastInit=Date.now();init()}
});

const q=$('#q'),xb=$('#x'),nav=$('#nav'),bub=$('#bub'),bp=$('#beta');
const W=()=>nav.clientWidth/5;

function glow(t){
 if(!S.set.g||t.st!='a'||!t.subs.length||pct(t)==100)return '';
 const dd=(Date.now()-(t.lp||Date.now()))/864e5;
 return dd>=9?' gl3':dd>=6?' gl2':dd>=3?' gl1':'';
}
function card(t,n){
 const p=pct(t);
 return `<div class="g card${glow(t)}" id="c${t.id}"><div class="row"><div class="tt">${n}. ${esc(t.title)}<div class="pr"><span>${p}%</span><div class="bar"><i style="width:${p}%"></i></div><span>100%</span></div></div><button class="pill" onclick="opn(${t.id})">${t.open?'закрыть':'открыть'}</button></div>`
 +(t.open?t.subs.map((s,j)=>`<div class="sub"><span>${esc(s.t)}</span><button class="pill sm" onclick="tog(${t.id},${j})">${s.d?'✓':'✕'}</button></div>`).join('')
  +`<div class="act"><button class="pill red" onclick="delT(${t.id})">${TR}</button><button class="pill" onclick="editT(${t.id})">Редактировать</button><button class="pill" onclick="fin(${t.id})">Завершить</button></div>`:'')
 +`</div>`;
}
function stats(){
 const a=S.tasks.filter(t=>t.st=='a').length,f=S.tasks.filter(t=>t.st=='f').length;
 const days=[];
 for(let i=6;i>=0;i--){const x=new Date();x.setHours(0,0,0,0);x.setDate(x.getDate()-i);days.push({k:x.getTime(),l:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][x.getDay()],n:0})}
 S.tasks.filter(t=>t.st=='f'&&t.ts).forEach(t=>{const x=new Date(t.ts);x.setHours(0,0,0,0);const z=days.find(y=>y.k==x.getTime());if(z)z.n++});
 const m=Math.max(1,...days.map(z=>z.n));
 return{a,f,html:days.map(z=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px"><span style="font-size:13px;opacity:.8">${z.n||''}</span><div style="width:60%;height:${Math.max(4,z.n/m*60)}px;border-radius:6px;background:rgba(255,255,255,${z.n?0.55:0.18})"></div><span style="font-size:13px;opacity:.7">${z.l}</span></div>`).join('')};
}
function renderProf(){
 const n=S.nick||tgNick(),u=tgPhoto(),k=u+'|'+n[0],av=$('#pav');
 $('#pname').textContent=n;
 $('#pdate').textContent='В приложении с '+new Date(S.since).toLocaleDateString('ru-RU');
 if(av.dataset.k!=k){av.dataset.k=k;const L=esc(n[0].toUpperCase());av.innerHTML=u?`<img src="${esc(u)}" onerror="this.parentNode.textContent='${L}'">`:L}
 const s=stats();$('#sa').textContent=s.a;$('#sf').textContent=s.f;$('#ch').innerHTML=s.html;
}
function render(){
 const f=q.value.trim().toLowerCase(),L=S.tasks.filter(t=>t.st=='a'),e=!L.length&&!f;
 $('#empty').style.display=(e&&page=='home')?'flex':'none';
 $('.srch').style.display=e?'none':'block';
 $('#list').innerHTML=L.filter(t=>t.title.toLowerCase().includes(f)).map((t,i)=>card(t,i+1)).join('')||(f?'<p style="text-align:center;opacity:.7;margin-top:30px">Ничего не найдено</p>':'');
 $('#af').innerHTML=`<button class="pill ${af=='f'?'on':''}" onclick="setAf('f')">Завершённые</button><button class="pill ${af=='d'?'on':''}" onclick="setAf('d')">Удалённые</button>`;
 const A=S.tasks.filter(t=>t.st==af).sort((a,b)=>(b.ts||0)-(a.ts||0));
 $('#al').innerHTML=A.map(t=>`<div class="sw"><button class="pill rs" onclick="restore(${t.id})">Восстановить</button><div class="g card swr">${esc(t.title)}<div class="pr"><span>${pct(t)}%</span><div class="bar"><i style="width:${pct(t)}%"></i></div></div></div></div>`).join('')||'<p style="text-align:center;opacity:.7;margin-top:30px">Здесь пока пусто</p>';
 $('#tc').classList.toggle('on',!!S.set.c);$('#tv').classList.toggle('on',!!S.set.v);$('#tl').classList.toggle('on',!!S.set.g);
 renderProf();
}
function opn(id){const t=gt(id);t.open=!t.open;save()}
function tog(id,j){
 const t=gt(id),b=pct(t);t.subs[j].d=!t.subs[j].d;
 if(t.subs[j].d)t.lp=Date.now();
 hap();save();
 if(b<100&&pct(t)==100)ask('Вы завершили задачу?','Да, завершил',()=>done(id),0,'Ещё нет');
}
function delT(id){ask('Удалить дело?','Удалить',()=>{const t=gt(id);t.st='d';t.ts=Date.now();save()})}
function fin(id){
 const t=gt(id);
 pct(t)==100?ask('Вы завершили задачу?','Да, завершил',()=>done(id),0,'Ещё нет'):ask('Не все подпункты выполнены. Завершить всё равно?','Завершить',()=>done(id),0);
}
function done(id){
 hapN();const c=$('#c'+id);if(S.set.c&&c)conf(c);
 setTimeout(()=>{const t=gt(id);t.st='f';t.ts=Date.now();save()},S.set.c?1500:0);
}
function conf(c){
 for(let i=0;i<28;i++){
  const p=document.createElement('i'),s=4+Math.random()*4,x=(Math.random()-.5)*90,y=70+Math.random()*100;
  p.style.cssText=`position:absolute;left:${10+Math.random()*80}%;bottom:8px;width:${s}px;height:${s}px;border-radius:${Math.random()<.5?'50%':'1px'};background:#fff;pointer-events:none`;
  c.appendChild(p);
  p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${x*.6}px,${-y}px)`,opacity:1,offset:.5},{transform:`translate(${x}px,${-y*.3}px)`,opacity:0}],{duration:1000+Math.random()*500,easing:'ease-out'}).onfinish=()=>p.remove();
 }
}
function restore(id){const t=gt(id);t.st='a';t.ts=Date.now();t.lp=Date.now();hap();save()}
function setAf(v){af=v;render()}
function tglS(k){S.set[k]=S.set[k]?0:1;if(k=='v')hap();save()}
function privacy(){modal(`<div>Политика конфиденциальности появится здесь перед открытым запуском приложения.</div><div class="btns"><button class="pill" onclick="closeM()">Понятно</button></div>`)}
function saveNick(){S.nick=$('#nk').value.trim();hap();save();$('#nk').blur()}
function editT(id){
 const t=gt(id);editing=id;
 modal(`<input id="et" value="${esc(t.title)}"><textarea id="es" rows="6" placeholder="Подпункты, каждый с новой строки">${esc(t.subs.map(s=>s.t).join('\n'))}</textarea><div class="btns"><button class="pill" onclick="saveE()">Сохранить</button><button class="pill" onclick="closeM()">Отмена</button></div>`);
}
function saveE(){
 const t=gt(editing),n=$('#et').value.trim();if(!n)return;
 const L=$('#es').value.split('\n').map(x=>x.trim()).filter(Boolean),old=t.subs.slice(),used=new Set();
 t.title=n;
 t.subs=L.map((x,j)=>{
  let k=old.findIndex((o,m)=>o.t==x&&!used.has(m));
  if(k<0&&old[j]&&!used.has(j)&&!L.includes(old[j].t))k=j;
  if(k>=0)used.add(k);
  return{t:x,d:k>=0?old[k].d:false};
 });
 closeM();save();
}
function openAdd(){modal(`<input id="nt" placeholder="Название дела"><textarea id="ns" rows="4" placeholder="Подпункты, каждый с новой строки"></textarea><div class="btns"><button class="pill" onclick="addT()">Создать</button><button class="pill" onclick="closeM()">Отмена</button></div>`)}
function addT(){
 const t=$('#nt').value.trim();if(!t)return;
 const subs=$('#ns').value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({t:x,d:false}));
 S.tasks.push({id:Date.now(),title:t,subs,open:false,st:'a',lp:Date.now()});closeM();save();
}
function modal(h){$('#mb').innerHTML=h;$('#md').classList.add('on')}
function closeM(){$('#md').classList.remove('on');if(pos!=tab)rst(tab)}
function ask(m,ok,fn,red=1,no='Отмена'){_f=fn;modal(`<div>${m}</div><div class="btns"><button class="pill ${red?'red':''}" onclick="closeM();_f()">${ok}</button><button class="pill" onclick="closeM()">${no}</button></div>`)}
function drw(o){$('#dr').classList.toggle('on',!!o);$('#ov').classList.toggle('on',!!o)}
function show(p){page=p;document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id==p));if(p=='profile')$('#nk').value=S.nick||tgNick();render()}
function openArch(){show('archive')}

function setB(a,b,dir){
 const w=W(),n=nav.clientWidth;
 bub.style.setProperty('--tl',dir<0?'.26s':'.44s');
 bub.style.setProperty('--tr',dir>0?'.26s':'.44s');
 bub.style.left=(a*w+4)+'px';
 bub.style.right=(n-(b+1)*w+4)+'px';
}
function rst(i){setB(i,i,Math.sign(i-pos)||1);pos=i}
function beta(){const r=nav.getBoundingClientRect();bp.style.left=(r.left+1.5*W())+'px';bp.classList.add('on')}
function go(i){
 clearTimeout(bt);
 if(i==1){rst(1);beta();hap();bt=setTimeout(()=>{bp.classList.remove('on');rst(tab)},3000);return}
 bp.classList.remove('on');
 if(i==2){rst(2);hap();openAdd();return}
 tab=i;rst(i);hap();show(i==0?'home':i==3?'settings':'profile');
}
nav.addEventListener('pointerdown',e=>{
 const x=e.clientX-nav.getBoundingClientRect().left,i=Math.max(0,Math.min(4,Math.floor(x/W())));
 d={x0:e.clientX,i,on:i==pos,m:0,c:0};nav.setPointerCapture(e.pointerId);
});
nav.addEventListener('pointermove',e=>{
 if(!d)return;
 const dx=e.clientX-d.x0;
 if(!d.m&&d.on&&Math.abs(dx)>8){d.m=1;bub.classList.add('drag');clearTimeout(bt);bp.classList.remove('on')}
 if(!d.m)return;
 const w=W(),n=nav.clientWidth;let c=Math.max(-w,Math.min(w,dx));
 if((pos==0&&c<0)||(pos==4&&c>0))c=0;
 d.c=c;
 const l=pos*w+4,r=n-(pos+1)*w+4;
 bub.style.left=(c<0?l+c:l)+'px';
 bub.style.right=(c>0?r-c:r)+'px';
});
nav.addEventListener('pointerup',()=>{
 if(!d)return;const x=d;d=null;bub.classList.remove('drag');
 if(x.m){const t=pos+(Math.abs(x.c)>W()*.35?Math.sign(x.c):0);t==pos?rst(pos):go(t)}
 else go(x.i);
});
nav.addEventListener('pointercancel',()=>{if(d){d=null;bub.classList.remove('drag');rst(pos)}});
addEventListener('resize',()=>setB(pos,pos,1));

q.addEventListener('input',()=>{xb.classList.toggle('on',!!q.value);render()});
q.addEventListener('keydown',e=>{if(e.key=='Enter')q.blur()});
q.addEventListener('focus',()=>document.body.classList.add('typing'));
q.addEventListener('blur',()=>document.body.classList.remove('typing'));
xb.addEventListener('pointerdown',()=>{xb._f=document.activeElement==q});
xb.addEventListener('click',()=>{q.value='';xb.classList.remove('on');render();if(xb._f)q.focus()});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#q,#x'))q.blur()});
$('#list').addEventListener('touchmove',()=>q.blur(),{passive:true});

$('#al').addEventListener('pointerdown',e=>{
 const r=e.target.closest('.swr');if(!r)return;
 sw={r,b:r.previousElementSibling,x:e.clientX,o:r.classList.contains('op')?-RV:0,m:0,v:0};
});
addEventListener('pointermove',e=>{
 if(!sw)return;const dx=e.clientX-sw.x;
 if(Math.abs(dx)>8)sw.m=1;
 if(sw.m){sw.v=Math.max(-RV,Math.min(0,sw.o+dx));sw.r.style.transition='none';sw.r.style.transform=`translateX(${sw.v}px)`;sw.b.style.opacity=-sw.v/RV}
});
function swEnd(){
 if(!sw)return;const open=(sw.m?sw.v:sw.o)<-RV/2;
 sw.r.style.transition='';sw.r.classList.toggle('op',open);
 sw.r.style.transform=open?`translateX(-${RV}px)`:'';sw.b.style.opacity=open?1:0;sw=null;
}
addEventListener('pointerup',swEnd);addEventListener('pointercancel',swEnd);

rst(0);render();
