<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<title>Фокус</title>
<style>
:root{--c:#7c5cff}
*{box-sizing:border-box}
body{margin:0;background:#111;color:#fff;font-family:-apple-system,sans-serif;padding-bottom:90px}
.screen{display:none;padding:20px}.screen.on{display:block}
h2{margin-top:0}
.card{background:#1c1c1e;border-radius:14px;padding:14px;margin-bottom:12px}
.bar{height:8px;background:#333;border-radius:4px;overflow:hidden;margin:8px 0}
.bar i{display:block;height:100%;background:var(--c)}
button{background:var(--c);color:#fff;border:0;border-radius:10px;padding:10px 14px;font-size:15px}
button.g{background:#333;margin-top:8px}
input,textarea{width:100%;padding:12px;border-radius:10px;border:0;background:#2a2a2c;color:#fff;font-size:16px;margin-bottom:8px;font-family:inherit}
nav{position:fixed;bottom:0;left:0;right:0;display:flex;background:#1c1c1e;padding:8px 0 calc(8px + env(safe-area-inset-bottom))}
nav button{flex:1;background:none;color:#aaa;border-radius:0}
nav button.on{color:var(--c)}
.fab{position:fixed;left:20px;bottom:90px;width:54px;height:54px;border-radius:27px;font-size:30px;padding:0}
#add{display:none}
</style></head><body>

<div class="screen on" id="home">
  <h2>Дело дня</h2>
  <div id="now"></div>
  <h3>Выбрать на сегодня</h3>
  <div id="pick"></div>
</div>

<div class="screen" id="tasks">
  <h2>Мои дела</h2>
  <div id="add" class="card">
    <input id="title" placeholder="Конечная цель / название дела">
    <textarea id="subs" rows="5" placeholder="Подпункты, каждый с новой строки"></textarea>
    <button onclick="addTask()">Создать</button>
    <button class="g" onclick="toggleAdd()">Отмена</button>
  </div>
  <div id="list"></div>
</div>

<div class="screen" id="settings">
  <h2>Настройки</h2>
  <p>Цвет интерфейса</p>
  <input type="range" min="0" max="360" id="hue" oninput="setHue(this.value)">
</div>

<button class="fab" onclick="show('tasks');toggleAdd()">+</button>
<nav>
  <button data-n="home" class="on" onclick="show('home')">Главная</button>
  <button data-n="tasks" onclick="show('tasks')">Дела</button>
  <button data-n="settings" onclick="show('settings')">Настройки</button>
</nav>

<script>
const tg=Telegram.WebApp;tg.ready();tg.expand();
const $=id=>document.getElementById(id);
let S;
try{S=JSON.parse(localStorage.getItem('s'))}catch(e){}
S=S||{tasks:[],today:{},hue:255};
const day=()=>new Date().toISOString().slice(0,10);
const pct=t=>t.subs.length?Math.round(t.subs.filter(s=>s.d).length/t.subs.length*100):0;
function save(){localStorage.setItem('s',JSON.stringify(S));render()}
function show(n){
  document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id==n));
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.n==n));
}
function toggleAdd(){const a=$('add');a.style.display=a.style.display=='block'?'none':'block'}
function addTask(){
  const t=$('title').value.trim();if(!t)return;
  const subs=$('subs').value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({t:x,d:false}));
  S.tasks.push({id:Date.now(),title:t,subs});
  $('title').value='';$('subs').value='';toggleAdd();save();
}
function tog(id,i){const t=S.tasks.find(x=>x.id==id);t.subs[i].d=!t.subs[i].d;save();
  if(pct(t)==100&&confirm('Дело завершено?')){}}
function pick(id){S.today={id,d:day()};save()}
function del(id){if(confirm('Удалить дело?')){S.tasks=S.tasks.filter(x=>x.id!=id);save()}}
function setHue(v){S.hue=+v;save()}
function card(t){
  return `<div class="card"><b>${t.title}</b> — ${pct(t)}%<div class="bar"><i style="width:${pct(t)}%"></i></div>`
  +t.subs.map((s,i)=>`<div><label><input type="checkbox" style="width:auto" ${s.d?'checked':''} onchange="tog(${t.id},${i})"> ${s.t}</label></div>`).join('')
  +`<button class="g" onclick="del(${t.id})">Удалить</button></div>`;
}
function render(){
  document.documentElement.style.setProperty('--c',`hsl(${S.hue},90%,65%)`);
  $('hue').value=S.hue;
  const tk=S.tasks.find(t=>t.id==S.today.id&&S.today.d==day());
  $('now').innerHTML=tk?card(tk):'<p>Дело на сегодня не выбрано.</p>';
  $('pick').innerHTML=S.tasks.map(t=>`<div class="card">${t.title} <button onclick="pick(${t.id})">На сегодня</button></div>`).join('')||'<p>Сначала добавь дело кнопкой «+».</p>';
  $('list').innerHTML=S.tasks.map(card).join('');
}
render();
</script>
</body></html>
