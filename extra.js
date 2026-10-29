const OP_NAME='Андрхоев Ислам Заурбиевич';
const OP_INN='';
const POLICY=`<p><b>Политика конфиденциальности</b><br>Редакция от 28.10.2026</p>
<p><b>1. Оператор.</b> Оператор персональных данных — самозанятый ${OP_NAME}${OP_INN?', ИНН '+OP_INN:''} (далее — Оператор), владелец мини-приложения «Фокус» в Telegram. Связь: everydayreques@gmail.com.</p>
<p><b>2. Какие данные мы обрабатываем.</b> Telegram ID и имя пользователя (ник), которые передаёт Telegram; введённые вами дела, подпункты, архив, настройки, статистика и дата первого запуска; отзывы (оценка, текст, ваш Telegram ID и ник). Фото профиля показывается из Telegram и не сохраняется. Мы не запрашиваем телефон, почту, геолокацию и платёжные данные и не используем рекламные трекеры.</p>
<p><b>3. Цели.</b> Работа приложения, хранение и синхронизация ваших дел между устройствами, получение и обработка отзывов, улучшение приложения. Для новых целей (напоминания, ИИ-функции, оплата) мы запросим отдельное согласие.</p>
<p><b>4. Основание.</b> Ваше согласие, которое вы даёте при первом входе. Приложение предназначено для пользователей от 14 лет.</p>
<p><b>5. Где хранятся данные.</b> Данные хранятся в облачной базе Supabase на серверах за пределами Российской Федерации (Европа). Страницы приложения размещены на Vercel, обмен идёт через Telegram. Нажимая «Продолжить», вы соглашаетесь на такое хранение и передачу.</p>
<p><b>6. Передача третьим лицам.</b> Мы не продаём и не передаём ваши данные. Они доступны только поставщикам инфраструктуры (Supabase, Vercel, Telegram), без которой приложение не работает.</p>
<p><b>7. Сроки.</b> Данные хранятся, пока вы пользуетесь приложением. Кнопка «Удалить аккаунт» в профиле сразу удаляет ваши дела и настройки с сервера. Отзыв можно удалить по письму на почту выше.</p>
<p><b>8. Ваши права.</b> Вы можете узнать, какие данные о вас хранятся, потребовать их исправления или удаления и отозвать согласие. Удаление аккаунта означает отзыв согласия. По остальным вопросам пишите на почту, мы ответим в срок, установленный законом.</p>
<p><b>9. Защита.</b> Доступ к данным идёт только по защищённому соединению с проверкой подписи Telegram; ключи доступа хранятся на сервере и не попадают в приложение.</p>
<p><b>10. Изменения.</b> При изменении политики мы покажем новую редакцию и при необходимости снова запросим согласие.</p>`;

function showPolicy(){modal(`<div style="max-height:62vh;overflow:auto;font-size:15px;line-height:1.45">${POLICY}</div><div class="btns"><button class="pill" onclick="closeM()">Закрыть</button></div>`)}
privacy=function(){showPolicy()};

function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),3000)}
const tEl=document.createElement('div');tEl.id='toast';tEl.className='toast g';document.body.appendChild(tEl);

const rv=document.createElement('div');rv.id='review';rv.className='scr';
rv.innerHTML=`<h2>Оставить отзыв</h2>
<div class="stars" id="stars">${[1,2,3,4,5].map(i=>`<button data-i="${i}" aria-label="${i}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>`).join('')}</div>
<div class="g card" style="margin-top:0"><textarea id="rt" maxlength="1000" placeholder="Что понравилось и что стоит улучшить"></textarea></div>
<button class="pill" id="rsend" disabled style="margin-top:16px;width:100%">Отправить</button>`;
document.body.appendChild(rv);
let rate=0;const rt=$('#rt'),rsend=$('#rsend');
function paint(){document.querySelectorAll('#stars button').forEach(b=>b.classList.toggle('on',+b.dataset.i<=rate));rsend.disabled=!(rate&&rt.value.trim())}
$('#stars').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;rate=+b.dataset.i;hap();paint()});
rt.addEventListener('input',paint);
rt.addEventListener('focus',()=>document.body.classList.add('typing'));
rt.addEventListener('blur',()=>document.body.classList.remove('typing'));
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#rt'))rt.blur()});
rsend.onclick=async()=>{
 rsend.disabled=true;
 try{
  await api('review',{rating:rate,text:rt.value.trim()});
  hapN();rate=0;rt.value='';paint();go(0);toast('Отзыв отправлен, спасибо');
 }catch(e){
  const m=String(e&&e.message||e);
  toast(m.startsWith('429')?'Слишком часто, попробуйте позже':'Не удалось отправить');paint();
 }
};
openReview=function(){clearTimeout(bt);show('review')};
document.querySelectorAll('#dr div').forEach(x=>{if(x.textContent=='Оставить отзыв'){x.style.opacity=1;x.onclick=()=>{drw(0);openReview()}}});

function showConsent(){
 const c=document.createElement('div');c.id='cons';
 c.innerHTML=`<div class="g card"><h2>Добро пожаловать</h2><div style="font-size:17px;line-height:1.4">Приложение хранит ваши дела в облаке, чтобы они не терялись и были на всех ваших устройствах. Для этого нужно ваше согласие.</div><label class="chk"><input type="checkbox" id="ck"><span>Мне есть 14 лет. Я прочитал(а) <u id="plink">политику конфиденциальности</u> и согласен(на) на обработку моих данных.</span></label><button class="pill" id="cb" disabled style="width:100%">Продолжить</button></div>`;
 document.body.appendChild(c);
 $('#ck').onchange=()=>{$('#cb').disabled=!$('#ck').checked};
 $('#plink').onclick=e=>{e.preventDefault();showPolicy()};
 $('#cb').onclick=()=>{S.consent={v:1,ts:Date.now()};c.remove();save();init()};
}
const _init=init;
init=function(){return S.consent?_init():Promise.resolve()};
const _del=delAcc;
delAcc=async function(){await _del();if(!S.consent&&!$('#cons'))showConsent()};

if(S.consent)init();else showConsent();
