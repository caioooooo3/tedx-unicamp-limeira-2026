const D=window.TEDX_DATA;
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const event=D.event;

$('[data-theme]').textContent=event.theme;
const dateEl=$('[data-date]'); if(dateEl) dateEl.textContent=event.date;
$$('[data-city]').forEach(el=>el.textContent=event.city);
$$('[data-time]').forEach(el=>{el.textContent=event.time; if(!event.time) el.hidden=true});
const venueEl=$('[data-venue]'); if(venueEl) venueEl.textContent=event.venue;
$$('[data-instagram]').forEach(a=>a.href=event.instagramUrl);
$$('[data-instagram-handle]').forEach(el=>el.textContent=event.instagramHandle);

const socialIcon=(type)=>({instagram:'Instagram',linkedin:'LinkedIn',website:'Site'}[type]||type);
const speakerIndexById=new Map(D.speakers.map((s,i)=>[s.id,i]));
const grid=$('#speakers-grid');

D.speakers.forEach((s,i)=>{
  const el=document.createElement('article');
  el.className='speaker';
  el.tabIndex=0;
  el.setAttribute('role','button');
  el.setAttribute('aria-label',`Abrir perfil de ${s.name}`);
  if(s.position) el.style.setProperty('--pos',s.position);
  const visual=s.image
    ? `<img src="${s.image}" alt="Foto de ${s.name}" loading="lazy">`
    : `<div class="speaker-placeholder" aria-label="Foto de ${s.name} em breve"><span>${s.initials||s.name.split(' ').map(p=>p[0]).slice(0,2).join('')}</span><small>foto em breve</small></div>`;
  el.innerHTML=`${visual}<div class="speaker-info"><div class="speaker-index">${s.time} // SPEAKER ${String(i+1).padStart(2,'0')}</div><div class="speaker-name">${s.name}</div><div class="speaker-role">${s.talk}</div><div class="speaker-more">Ver perfil <span>↗</span></div></div>`;
  const open=()=>openSpeaker(i);
  el.addEventListener('click',open);
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  grid.appendChild(el);
});

function renderSchedule(target,items){
  const root=$(target);
  root.innerHTML=items.map(item=>{
    const block=item.block?`<div class="schedule-block"><span>${item.block}</span></div>`:'';
    const kind=item.kind?` is-${item.kind}`:'';
    const speakerAttr=item.speakerId?` data-speaker-id="${item.speakerId}" role="button" tabindex="0" aria-label="Abrir perfil de ${D.speakers[speakerIndexById.get(item.speakerId)]?.name||'palestrante'}"`:'';
    const clickHint=item.speakerId?`<span class="schedule-open">ver perfil ↗</span>`:'';
    return `${block}<div class="schedule-row${kind}${item.speakerId?' is-clickable':''}"${speakerAttr}><div class="schedule-time">${item.time}</div><div class="schedule-title">${item.title}${clickHint}</div><div class="schedule-status">${item.status}</div></div>`;
  }).join('');
}
renderSchedule('#main-schedule',D.schedule);
renderSchedule('#extra-schedule',D.extraTalk.schedule);

$$('[data-speaker-id]').forEach(row=>{
  const open=()=>{
    const i=speakerIndexById.get(row.dataset.speakerId);
    if(i!==undefined)openSpeaker(i);
  };
  row.addEventListener('click',open);
  row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
});

$('#extra-title').innerHTML=D.extraTalk.title.replace(/\n/g,'<br>');
$('#extra-description').textContent=D.extraTalk.description;
$('#extra-artist').textContent=D.extraTalk.artist;
$('#extra-artist-role').textContent=D.extraTalk.artistRole;
$('#extra-artist-bio').textContent=D.extraTalk.bio;
const extraVisual=$('#extra-artist-visual');
if(D.extraTalk.image){extraVisual.innerHTML=`<img src="${D.extraTalk.image}" alt="Foto de ${D.extraTalk.artist}">`;extraVisual.removeAttribute('aria-hidden')}
const extraLinks=[['Instagram',D.extraTalk.instagram],['Site',D.extraTalk.website]].filter(([,url])=>url);
$('#extra-artist-socials').innerHTML=extraLinks.length?extraLinks.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join(''):'<span class="social-empty">Redes do artista em breve.</span>';

const bars=$$('.bar'),pct=$('#signal-pct');
function updateSignal(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const progress=Math.min(1,Math.max(0,scrollY/max));
  const remaining=Math.max(0,Math.round((1-progress)*100));
  const active=Math.ceil(remaining/10);
  bars.forEach((b,i)=>{b.classList.toggle('is-off',i>=active)});
  pct.textContent=`${remaining}%`;
}
addEventListener('scroll',updateSignal,{passive:true});
addEventListener('resize',updateSignal,{passive:true});
updateSignal();

const modal=$('#speaker-modal');
const modalImage=$('#modal-image'),modalPlaceholder=$('#modal-placeholder'),modalName=$('#modal-name'),modalRole=$('#modal-role'),modalTalk=$('#modal-talk'),modalBio=$('#modal-bio'),modalIndex=$('#modal-index'),modalSocials=$('#modal-socials');
let lastFocused=null;
function openSpeaker(i){
  const s=D.speakers[i];
  lastFocused=document.activeElement;
  if(s.image){
    modalImage.src=s.image;
    modalImage.alt=`Foto de ${s.name}`;
    modalImage.hidden=false;
    modalPlaceholder.hidden=true;
  }else{
    modalImage.removeAttribute('src');
    modalImage.alt='';
    modalImage.hidden=true;
    modalPlaceholder.hidden=false;
    modalPlaceholder.innerHTML=`<span>${s.initials||'TEDx'}</span><small>foto em breve</small>`;
  }
  modalName.textContent=s.name;
  modalRole.textContent=s.role;
  modalTalk.textContent=s.talk;
  modalBio.textContent=s.bio;
  modalIndex.textContent=`${s.time} // SPEAKER ${String(i+1).padStart(2,'0')}`;
  const links=[['instagram',s.instagram],['linkedin',s.linkedin],['website',s.website]].filter(([,url])=>url);
  modalSocials.innerHTML=links.length?links.map(([type,url])=>`<a href="${url}" target="_blank" rel="noopener">${socialIcon(type)} ↗</a>`).join(''):'<span class="social-empty">Redes sociais em breve.</span>';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  $('.modal-close',modal).focus();
}
function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  if(lastFocused)lastFocused.focus();
}
$$('[data-modal-close]').forEach(el=>el.addEventListener('click',closeModal));
addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal()});

const menuToggle=$('.menu-toggle'),mobileMenu=$('#mobile-menu');
menuToggle.addEventListener('click',()=>{
  const open=mobileMenu.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open',open);
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('is-open');menuToggle.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false')}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.08});
$$('.reveal').forEach(el=>revealObserver.observe(el));

const navLinks=$$('#desktop-nav a');
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  navLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${entry.target.id}`));
}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
['tema','speakers','extra','programacao','evento'].forEach(id=>{const el=document.getElementById(id);if(el)sectionObserver.observe(el)});
