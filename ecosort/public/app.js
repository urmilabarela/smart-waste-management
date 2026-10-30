const CATS={
organic:{n:'Organic',c:'#2ecc71',i:'🍌',e:['Food scraps','Fruit & veg peels','Garden leaves'],d:'Compost at home or use the green bin. Keep it free of plastic.'},
recyclable:{n:'Recyclable',c:'#3498db',i:'♻️',e:['Plastic bottles','Paper & cardboard','Glass, metal cans'],d:'Rinse, dry and place in the blue bin or take to a recycling hub.'},
ewaste:{n:'E-Waste',c:'#9b59b6',i:'🔋',e:['Old phones & chargers','Batteries','Laptops & cables'],d:'Never bin it. Hand over to an authorised e-waste collection point.'},
hazardous:{n:'Hazardous',c:'#e74c3c',i:'☣️',e:['Paint & solvents','Expired medicine','Chemicals, syringes'],d:'Keep sealed and labelled. Use a safe disposal facility only.'},
nonrecyclable:{n:'Non-Recyclable',c:'#95a5a6',i:'🗑️',e:['Chip wrappers','Thermocol','Diapers'],d:'Wrap securely and put in the general (grey) bin. Reduce where possible.'}};
const $=s=>document.querySelector(s),page=document.body.dataset.page;
const toast=t=>{let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.append(e)}e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)};
const P=[['index','Home'],['track','Track'],['centers','Find a Center'],['how','How It Works'],['contact','Contact Us'],['feedback','Feedback']];
$('#nav').outerHTML=`<nav><b>ECO<span>SORT</span> 🇮🇳</b>${P.map(p=>`<a href="${p[0]}.html" class="${p[0]==page?'on':''}">${p[1]}</a>`).join('')}</nav>`;
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.15});
const reveal=()=>document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
const catHTML=k=>{const c=CATS[k];return `<div class="card tag reveal" style="--c:${c.c}"><div class="ic">${c.i}</div><h3>${c.n}</h3><b>Examples</b><ul>${c.e.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Disposal:</b> ${c.d}</p></div>`};
// Read image -> resized dataURL + average colour, then ask backend to classify
function readImg(file){return new Promise(ok=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,480/im.width);c.width=im.width*s;c.height=im.height*s;const x=c.getContext('2d');x.drawImage(im,0,0,c.width,c.height);
 const d=x.getImageData(0,0,c.width,c.height).data;let r=0,g=0,b=0,n=d.length/4;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2]}
 ok({url:c.toDataURL('image/jpeg',.7),rgb:[r/n,g/n,b/n].map(Math.round)})};im.src=URL.createObjectURL(file)})}
const classify=async(file)=>{const i=await readImg(file),r=await post('/api/classify',{filename:file.name,rgb:i.rgb});return{...r,image:i.url}};
const guide=(r)=>`<div class="card tag" style="--c:${CATS[r.category].c}"><h3>${CATS[r.category].i} ${CATS[r.category].n} <small>(${Math.round(r.confidence*100)}% match)</small></h3><p>${CATS[r.category].d}</p><ul>${CATS[r.category].e.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;

if(page=='classify'){$('#f').onchange=async e=>{const f=e.target.files[0];if(!f)return;const r=await classify(f);$('#pv').src=r.image;$('#pv').hidden=false;$('#out').innerHTML=guide(r)}}
if(page=='report'){
 const sel=$('#cat');sel.innerHTML=Object.keys(CATS).map(k=>`<option value="${k}">${CATS[k].n}</option>`).join('');
 $('#date').value=new Date().toLocaleString();let img='',pos={};
 $('#f').onchange=async e=>{const f=e.target.files[0];if(!f)return;const r=await classify(f);img=r.image;$('#pv').src=img;$('#pv').hidden=false;sel.value=r.category;$('#ai').textContent=`🤖 AI suggests: ${CATS[r.category].n} (${Math.round(r.confidence*100)}%)`};
 $('#loc').onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(async p=>{pos={lat:p.coords.latitude,lng:p.coords.longitude};$('#addr').value=`${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
  try{const j=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`)).json();if(j.display_name)$('#addr').value=j.display_name}catch{}},()=>toast('Location permission denied - type address manually')):toast('Geolocation unsupported');
 $('#go').onclick=async()=>{const r=await post('/api/reports',{name:$('#name').value,phone:$('#phone').value,category:sel.value,address:$('#addr').value,details:$('#det').value,image:img,...pos});
  $('#done').innerHTML=r.error?`<div class="card">❌ ${r.error}</div>`:`<div class="card">✅ Report submitted! Your ID: <h2>${r.id}</h2><a class="btn sm" href="track.html?id=${r.id}">Track it</a></div>`}}
if(page=='track'){const go=async()=>{const id=$('#rid').value.trim();if(!id)return;const r=await(await fetch('/api/reports/'+id)).json();
  $('#out').innerHTML=r.error?`<div class="card">❌ ${r.error}</div>`:`<div class="card"><h3>${r.id} · ${CATS[r.category]?.n||''}</h3><p>${r.address||''}</p>${r.team?`<p>👷 ${r.team}</p>`:''}<ul class="tl">${r.steps.map((s,i)=>`<li class="${i<=r.step?'done':''}">${s}</li>`).join('')}</ul></div>`;
  if(r.step<4)clearTimeout(window.t),window.t=setTimeout(go,5000)};
 $('#go').onclick=go;const q=new URLSearchParams(location.search).get('id');if(q){$('#rid').value=q;go()}}
if(page=='centers'){let map,base=[23.2599,77.4126],mk=[],all=[],f='all';
 const draw=()=>{mk.forEach(m=>m.remove());mk=[];const l=all.filter(c=>f=='all'||c.cats.includes(f));
  $('#list').innerHTML=l.map(c=>`<div class="card"><h3>📍 ${c.name}</h3><p>${c.addr} · ${c.hours}</p><p>Accepts: ${c.cats.map(k=>CATS[k].i+' '+CATS[k].n).join(', ')}</p><a class="btn sm" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}">Directions</a></div>`).join('');
  l.forEach(c=>mk.push(L.marker([c.lat,c.lng]).addTo(map).bindPopup(`<b>${c.name}</b><br>${c.addr}`)))};
 const init=async()=>{map=L.map('map').setView(base,13);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
  all=(await(await fetch('/api/centers')).json()).map(c=>({...c,lat:base[0]+c.dLat,lng:base[1]+c.dLng}));draw()};
 $('#chips').innerHTML='<button class="on" data-k="all">All</button>'+Object.keys(CATS).map(k=>`<button data-k="${k}">${CATS[k].i} ${CATS[k].n}</button>`).join('');
 $('#chips').onclick=e=>{if(!e.target.dataset.k)return;f=e.target.dataset.k;document.querySelectorAll('#chips button').forEach(b=>b.classList.toggle('on',b==e.target));draw()};
 navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{base=[p.coords.latitude,p.coords.longitude];init()},init):init()}
if(page=='how')reveal();

const cur=document.createElement('div');cur.className='cur';document.body.append(cur);
addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';cur.classList.toggle('h',!!e.target.closest('a,button,.card,label')||!!window.hov)});
addEventListener('scroll',()=>document.querySelector('nav').classList.toggle('sc',scrollY>40));

