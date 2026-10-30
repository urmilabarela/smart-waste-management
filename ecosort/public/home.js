(()=>{
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),sm=(x,a,b)=>{x=clamp((x-a)/(b-a));return x*x*(3-2*x)};
const pc=$('#pc');let n=0;const iv=setInterval(()=>{n=Math.min(100,n+Math.ceil(Math.random()*8));pc.textContent=n;if(n>=100){clearInterval(iv);setTimeout(()=>$('#pre').classList.add('out'),300)}},60);
$('#mq').innerHTML='SWACHH BHARAT ✦ कचरा अलग करें ✦ REDUCE · REUSE · RECYCLE ✦ स्वच्छ भारत ✦ GREEN INDIA ✦ '.repeat(4);
$('#cats').innerHTML=Object.keys(CATS).map(catHTML).join('');reveal();
const hg=$('#hg'),tr=$('#htr');addEventListener('scroll',()=>{const q=clamp((scrollY-hg.offsetTop)/(hg.offsetHeight-innerHeight));tr.style.transform=`translateX(${-q*(tr.scrollWidth-innerWidth+60)}px)`});
// ---- 3D polluted Indian street ----
const el=$('#scene'),W=()=>el.clientWidth,H=()=>el.clientHeight;
const R=new THREE.WebGLRenderer({antialias:true});R.setSize(W(),H());R.setPixelRatio(Math.min(devicePixelRatio,2));el.append(R.domElement);
const smog=new THREE.Color(0x9c8a63),sky=new THREE.Color(0x0d47b5),S=new THREE.Scene();S.fog=new THREE.FogExp2(smog,.055);S.background=smog.clone();
const C=new THREE.PerspectiveCamera(52,W()/H(),.1,200),hemi=new THREE.HemisphereLight(0xfff0c8,0x333344,.9),sun=new THREE.DirectionalLight(0xffc27a,.9);sun.position.set(-6,12,8);S.add(hemi,sun);
const M=(c,r=.8)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const road=new THREE.Mesh(new THREE.PlaneGeometry(9,160),M(0x2a2a30,1));road.rotation.x=-Math.PI/2;road.position.z=-55;S.add(road);
[-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(3,.25,160),M(0x6b6660,1));w.position.set(s*6,.12,-55);S.add(w)});
const cv=document.createElement('canvas');cv.width=64;cv.height=128;const q=cv.getContext('2d');q.fillStyle='#fff';q.fillRect(0,0,64,128);
for(let r=0;r<8;r++)for(let c=0;c<4;c++){q.fillStyle=Math.random()>.55?'#ffd27a':'#5a4a38';q.fillRect(6+c*15,6+r*15,9,10)}
const wt=new THREE.CanvasTexture(cv),pal=[0xd9a066,0xc0714f,0xe3b7a0,0x8fb3c9,0xe8cf7a,0xb08fb5];
for(let i=0;i<18;i++)[-1,1].forEach(s=>{const h=5+Math.random()*9,w=3.2+Math.random()*2,b=new THREE.Mesh(new THREE.BoxGeometry(w,h,4.5),new THREE.MeshStandardMaterial({color:pal[Math.floor(Math.random()*6)],map:wt,roughness:.9}));b.position.set(s*(8+w/2),h/2,8-i*5);S.add(b)});
const mk={
bottle:()=>{const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.55,12),new THREE.MeshStandardMaterial({color:0x8fd3ff,transparent:true,opacity:.8,roughness:.2})),c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.1,8),M(0x1f6bff));c.position.y=.32;g.add(b,c);return g},
tyre:()=>new THREE.Mesh(new THREE.TorusGeometry(.35,.14,10,20),M(0x151515)),
bag:()=>new THREE.Mesh(new THREE.IcosahedronGeometry(.4,1),M(0xeeeeee,.5)),
box:()=>new THREE.Mesh(new THREE.BoxGeometry(.6,.45,.5),M(0xb08a5a)),
can:()=>new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.2,12),M(0xc0c0c8,.3)),
peel:()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.3,14,10),M(0xe6c229));m.scale.set(1.3,.55,.7);return m},
phone:()=>{const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(.4,.75,.08),M(0x222230,.3)),new THREE.Mesh(new THREE.BoxGeometry(.34,.62,.09),M(0x3a7bd5,.2)));return g},
paint:()=>{const g=new THREE.Group(),l=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.06,14),M(0x999999,.3));l.position.y=.28;g.add(new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.5,14),M(0xd93025,.4)),l);return g},
chips:()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.7,.85,.12),M(0xff9933,.3));m.rotation.z=.2;return m}};
const junk=['bottle','tyre','bag','box','can','peel','bag','box'],heaps=new THREE.Group();S.add(heaps);
const heap=(x,z,n)=>{const g=new THREE.Group();g.position.set(x,.25,z);for(let i=0;i<n;i++){const o=mk[junk[Math.floor(Math.random()*8)]]();o.position.set((Math.random()-.5)*2.4,Math.random()*.9,(Math.random()-.5)*2.2);o.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6);g.add(o)}heaps.add(g)};
for(let i=0;i<12;i++){heap(-5.8+Math.random()*.8,-4-i*5.5,16);heap(5.6+Math.random()*.8,-6-i*6,14)}
const rick=new THREE.Group();[[0,.7,0,1.4,.9,2,0xf2c400],[0,1.25,0,1.5,.12,2.1,0x111111]].forEach(a=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a[3],a[4],a[5]),M(a[6]));m.position.set(a[0],a[1],a[2]);rick.add(m)});
[[-.7,.3,.7],[.7,.3,.7],[0,.3,-.8]].forEach(p=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.15,14),M(0x111111));w.rotation.z=Math.PI/2;w.position.set(...p);rick.add(w)});rick.position.set(2.2,0,-14);rick.rotation.y=.3;S.add(rick);
const fl=new THREE.Group(),pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,5,8),M(0xcccccc));pole.position.y=2.5;fl.add(pole);
[0xff9933,0xffffff,0x138808].forEach((c,i)=>{const s=new THREE.Mesh(new THREE.BoxGeometry(1.5,.32,.03),M(c,.6));s.position.set(.8,4.7-i*.32,0);fl.add(s)});fl.position.set(4.9,0,-3);S.add(fl);
const N=700,pg=new THREE.BufferGeometry(),pa=new Float32Array(N*3);for(let i=0;i<N*3;i+=3){pa[i]=(Math.random()-.5)*30;pa[i+1]=Math.random()*12;pa[i+2]=10-Math.random()*90}
pg.setAttribute('position',new THREE.BufferAttribute(pa,3));const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xcbb98a,size:.09,transparent:true,opacity:.7}));S.add(dust);
const label=(t,c)=>{const k=document.createElement('canvas');k.width=256;k.height=64;const x=k.getContext('2d');x.fillStyle=c;x.fillRect(0,0,256,64);x.fillStyle='#fff';x.font='700 28px sans-serif';x.textAlign='center';x.fillText(t.toUpperCase(),128,42);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(k),fog:false}));s.scale.set(1.8,.45,1);return s};
const keys=Object.keys(CATS),bins={};
keys.forEach((k,i)=>{const b=new THREE.Group(),l=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.12,24),M(0x111111)),lb=label(CATS[k].n,CATS[k].c);l.position.y=.86;lb.position.y=1.7;b.add(new THREE.Mesh(new THREE.CylinderGeometry(.85,.68,1.6,24),M(CATS[k].c,.5)),l,lb);b.position.set((i-2)*2.3,.8,-1.5);S.add(b);bins[k]=b});
const T=[['organic','peel'],['recyclable','bottle'],['ewaste','phone'],['hazardous','paint'],['nonrecyclable','chips']],items=[],fly=[];let score=0;
const spawn=t=>{const o=mk[T[t][1]]();o.scale.setScalar(1.5);o.position.set((Math.random()-.5)*8,.7,2+Math.random()*3);o.userData.cat=T[t][0];S.add(o);items.push(o)};
for(let i=0;i<10;i++)spawn(i%5);
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
const pick=e=>{const r=R.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,C);const h=ray.intersectObjects(items,true)[0];if(!h)return null;let o=h.object;while(!o.userData.cat)o=o.parent;return o.userData.fly?null:o};
R.domElement.onclick=e=>{const o=pick(e);if(o){o.userData.fly=1;fly.push({o,f:o.position.clone(),t:0})}};
R.domElement.onmousemove=e=>{window.hov=!!pick(e)};
let mx=0;addEventListener('mousemove',e=>mx=e.clientX/innerWidth-.5);
const pin=$('#pin'),hls=[...document.querySelectorAll('.hl')],clk=new THREE.Clock(),cl=new THREE.Color(0xcfe3ff),warm=new THREE.Color(0xfff0c8);
(function loop(){requestAnimationFrame(loop);const dt=clk.getDelta(),t=clk.elapsedTime,p=clamp((scrollY-pin.offsetTop)/(pin.offsetHeight-innerHeight)),walk=sm(p,.22,.9),clean=clamp(sm(p,.6,1)+score*.03);
 hls.forEach(h=>{const[a,b]=h.dataset.r.split(',');h.classList.toggle('on',p>=+a&&p<+b)});
 S.fog.color.copy(smog).lerp(sky,clean);S.background.copy(S.fog.color);S.fog.density=.055-clean*.038;sun.intensity=.9-clean*.3;hemi.color.copy(warm).lerp(cl,clean);
 dust.material.opacity=.7*(1-clean);heaps.scale.y=1-clean*.95;rick.position.z=-14+Math.sin(t*.5)*.4;
 items.forEach(o=>{if(!o.userData.fly)o.rotation.y+=dt});
 for(let i=fly.length-1;i>=0;i--){const a=fly[i],b=bins[a.o.userData.cat];a.t+=dt*1.1;const u=Math.min(a.t,1);
  a.o.position.lerpVectors(a.f,new THREE.Vector3(b.position.x,1.7,b.position.z),u);a.o.position.y+=Math.sin(Math.PI*u)*3;a.o.rotation.x+=dt*8;a.o.scale.setScalar(1.5*(1-u*.7));b.scale.y=1+Math.sin(Math.PI*u)*.08;
  if(u>=1){S.remove(a.o);items.splice(items.indexOf(a.o),1);fly.splice(i,1);b.scale.y=1;$('#score').textContent='SORTED '+ ++score;toast(CATS[a.o.userData.cat].n+' ✔ correct bin!');setTimeout(()=>spawn(keys.indexOf(a.o.userData.cat)),1200)}}
 C.position.set(mx*3,3.3-walk*1.4,9-walk*32);C.lookAt(-mx*1.5,1.6,C.position.z-9);R.render(S,C)})();
addEventListener('resize',()=>{R.setSize(W(),H());C.aspect=W()/H();C.updateProjectionMatrix()});
})();
