const D=window.TEDX_DATA;
const $=(s)=>document.querySelector(s);
const event=D.event;
$('[data-theme]').textContent=event.theme;
$('[data-date]').textContent=event.date;
document.querySelectorAll('[data-city]').forEach(el=>el.textContent=event.city);
document.querySelectorAll('[data-time]').forEach(el=>el.textContent=event.time);
$('[data-venue]').textContent=event.venue;
document.querySelectorAll('[data-tickets]').forEach(a=>{a.href=event.ticketsUrl;a.target='_blank';a.rel='noopener'});
document.querySelectorAll('[data-instagram]').forEach(a=>a.href=event.instagramUrl);

const grid=$('#speakers-grid');
D.speakers.forEach((s,i)=>{
  const el=document.createElement('article'); el.className='speaker';
  if(s.position) el.style.setProperty('--pos', s.position);
  el.innerHTML=`<img src="${s.image}" alt="Foto do palestrante ${i+1}" loading="lazy"><div class="speaker-info"><div class="speaker-index">SPEAKER // ${String(i+1).padStart(2,'0')}</div><div class="speaker-name">${s.name}</div><div class="speaker-role">${s.role}</div></div>`;
  grid.appendChild(el);
});

const bars=[...document.querySelectorAll('.bar')], pct=$('#signal-pct');
function updateSignal(){
  const max=document.documentElement.scrollHeight-innerHeight;
  const progress=max?Math.min(1,scrollY/max):0;
  const active=Math.max(1,10-Math.floor(progress*10));
  bars.forEach((b,i)=>b.style.opacity=i<active?'1':'.14');
  pct.textContent=`${active*10}%`;
}
addEventListener('scroll',updateSignal,{passive:true}); updateSignal();
