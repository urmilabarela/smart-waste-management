// Home page: category cards + polluted Indian street 3D scene (uses helpers from app.js)
$('#cats').innerHTML=Object.keys(CATS).map(k=>{const c=CATS[k];return `<div class="card cc reveal" style="--c:${c.c}"><div class="ph" style="background-image:url(img/c-${k}.jpg),linear-gradient(135deg,${c.c},#061534)"><em>${c.i}</em></div><div><h3>${c.n}</h3><b>Examples</b><ul>${c.e.map(x=>`<li>${x}</li>`).join('')}</ul><p><b>Disposal:</b> ${c.d}</p></div></div>`}).join('');
reveal();
(function(){const el=$('#scene'),W=()=>el.clientWidth,H=()=>el.clientHeight,rnd=Math.random;
 const R=new THREE.WebGLRenderer({antialias:true});R.setSize(W(),H());R.setPixelRatio(Math.min(devicePixelRatio,2));el.append(R.domElement);
 const dirty=new THREE.Color(0x8a7650),clean=new THREE.Color(0x0e4a9a),bg=new THREE.Color(dirty);
 const S=new THREE.Scene();S.fog=new THREE.FogExp2(dirty,.05);const C=new THREE.PerspectiveCamera(55,W()/H(),.1,120);
 S.add(new THREE.HemisphereLight(0xfff1cc,0x223355,.95));const sun=new THREE.DirectionalLight(0xffe2a8,.9);sun.position.set(-6,10,6);S.add(sun);
 const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.85,...o});
 const road=new THREE.Mesh(new THREE.PlaneGeometry(9,100),M(0x2a2a2e));road.rotation.x=-Math.PI/2;road.position.z=-35;S.add(road);
 for(let z=8;z>-80;z-=4){const s=new THREE.Mesh(new THREE.PlaneGeometry(.15,1.6),M(0xdddddd));s.rotation.x=-Math.PI/2;s.position.set(0,.01,z);S.add(s)}
 const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,64,64);g.fillStyle='#3a3f4a';for(let x=6;x<64;x+=16)for(let y=6;y<64;y+=16)g.fillRect(x,y,8,10);
 const wt=new THREE.CanvasTexture(cv);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;const blds=[],bc=[0xc9a27a,0xb5836b,0x9aa5b1,0xd8c3a5,0x8f7f74,0xe0b48a,0x6f9fb0];
 for(let sd=-1;sd<=1;sd+=2)for(let z=6;z>-80;z-=3.2){const h=3+rnd()*8,t=wt.clone();t.repeat.set(1,Math.round(h/1.5));t.needsUpdate=true;const b=new THREE.Mesh(new THREE.BoxGeometry(2.6,h,3),M(bc[Math.floor(rnd()*7)],{map:t}));b.position.set(sd*(5.8+rnd()*.6),h/2,z);S.add(b);blds.push(b)}
 const pc=[0x6b4a2f,0x2d6a4f,0x9aa0a6,0xd94f4f,0x3b6fd4,0xe8d9b5,0x222222];
 for(let i=0;i<320;i++){const s=.12+rnd()*.35,m=new THREE.Mesh(rnd()>.5?new THREE.BoxGeometry(s,s*.8,s):new THREE.IcosahedronGeometry(s*.6,0),M(pc[i%7]));m.position.set((rnd()>.5?1:-1)*(3.3+rnd()*1.2),s/2+rnd()*.25,6-rnd()*80);m.rotation.set(rnd(),rnd(),rnd());S.add(m)}
 const pa=new Float32Array(1200);for(let i=0;i<1200;i+=3){pa[i]=(rnd()-.5)*24;pa[i+1]=rnd()*9;pa[i+2]=6-rnd()*50}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));const smog=new THREE.Points(pg,new THREE.PointsMaterial({color:0xd9c9a0,size:.4,transparent:true,opacity:.35}));S.add(smog);
 const keys=Object.keys(CATS),bins={};
 keys.forEach((k,i)=>{const b=new THREE.Group();b.add(new THREE.Mesh(new THREE.CylinderGeometry(.62,.5,1.2,20),M(CATS[k].c)));const l=new THREE.Mesh(new THREE.CylinderGeometry(.66,.66,.1,20),M(0x222222));l.position.y=.65;b.add(l);b.position.set((i-2)*1.6,.6,-2.5);S.add(b);bins[k]=b});
 const mk=t=>{const g=new THREE.Group(),a=(geo,c,o,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,M(c,o));m.position.set(x,y,z);g.add(m)},gl={transparent:true,opacity:.7};
  if(t==0){a(new THREE.TorusGeometry(.3,.09,8,18,Math.PI*.9),0xe3c934)}
  if(t==1){a(new THREE.CylinderGeometry(.15,.15,.5,16),0x9fd8ff,gl);a(new THREE.CylinderGeometry(.05,.08,.2,12),0x9fd8ff,gl,0,.33);a(new THREE.CylinderGeometry(.06,.06,.06,12),0x1f7bff,{},0,.46)}
  if(t==2){a(new THREE.BoxGeometry(.32,.6,.05),0x15151c);a(new THREE.BoxGeometry(.27,.5,.02),0x2b6cb0,{emissive:0x0a2a5c},0,0,.03)}
  if(t==3){a(new THREE.CylinderGeometry(.24,.24,.5,16),0xc0392b);a(new THREE.CylinderGeometry(.25,.25,.08,16),0xf1c40f,{},0,.05)}
  if(t==4){a(new THREE.BoxGeometry(.55,.42,.1),0xd6336c);a(new THREE.BoxGeometry(.5,.14,.11),0xffd43b,{},0,-.05)}
  g.scale.setScalar(1.7);g.userData.cat=keys[t];dress(g,[keys[t]],.6,.3);return g};

 // ---- optional real photos & 3D models (drop files in public/img and public/models; missing = procedural fallback) ----
 const TL=new THREE.TextureLoader(),GL=THREE.GLTFLoader?new THREE.GLTFLoader():null,cache={};
 const tex=(f,cb)=>TL.load('img/'+f,t=>{t.encoding=THREE.sRGBEncoding;cb(t)},undefined,()=>{});
 const model=(n,ok,no)=>{if(!GL)return no&&no();cache[n]=cache[n]||new Promise((y,x)=>GL.load('models/'+n+'.glb',g=>y(g.scene),undefined,x));cache[n].then(ok).catch(()=>no&&no())};
 const dress=(g,names,h,half,tint)=>{const [n,...rest]=names;model(n,s=>{const m=s.clone(true),b=new THREE.Box3().setFromObject(m),f=h/b.getSize(new THREE.Vector3()).y,c=b.getCenter(new THREE.Vector3());
   m.scale.setScalar(f);m.position.set(-c.x*f,-b.min.y*f-half,-c.z*f);
   if(tint)m.traverse(o=>{if(o.isMesh){o.material=o.material.clone();if(o.material.color)o.material.color.lerp(new THREE.Color(tint),.35)}});
   g.children.slice().forEach(o=>g.remove(o));g.add(m)},()=>rest.length&&dress(g,rest,h,half,tint))};
 tex('road.jpg',t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,24);road.material.map=t;road.material.color.set(0xffffff);road.material.needsUpdate=true});
 tex('backdrop.jpg',t=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(70,34),new THREE.MeshBasicMaterial({map:t,fog:false}));p.position.set(0,13,-82);S.add(p)});
 tex('building.jpg',t=>blds.forEach(b=>{const m=t.clone();m.needsUpdate=true;m.wrapS=m.wrapT=THREE.RepeatWrapping;m.repeat.set(1,Math.max(1,b.geometry.parameters.height/4));b.material.map=m;b.material.color.set(0xffffff);b.material.needsUpdate=true}));
 keys.forEach(k=>{tex('bin-'+k+'.jpg',t=>{const m=bins[k].children[0].material;m.map=t;m.color.set(0xffffff);m.needsUpdate=true});dress(bins[k],['bin-'+k,'bin'],1.5,.6,'bin-'+k&&CATS[k].c)});
 const items=[],fly=[];let score=0,mx=0;
 const spawn=t=>{const m=mk(t);m.position.set((rnd()-.5)*7,.5,.4+rnd()*3.2);m.rotation.y=rnd()*6;S.add(m);items.push(m)};
 for(let i=0;i<12;i++)spawn(i%5);
 const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
 const pick=e=>{const r=R.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,C);let o=ray.intersectObjects(items,true)[0]?.object;while(o&&!o.userData.cat)o=o.parent;return o};
 R.domElement.onclick=e=>{const m=pick(e);if(!m||m.userData.fly)return;m.userData.fly=1;fly.push({m,f:m.position.clone(),t:0})};
 addEventListener('mousemove',e=>mx=e.clientX/innerWidth-.5);
 const clk=new THREE.Clock();(function loop(){requestAnimationFrame(loop);const dt=clk.getDelta(),k=Math.min(1,score/14);
  items.forEach(m=>{if(!m.userData.fly){m.rotation.y+=dt*.8;m.position.y=.5+Math.sin(clk.elapsedTime*2+m.id)*.05}});
  for(let i=fly.length-1;i>=0;i--){const a=fly[i],b=bins[a.m.userData.cat];a.t+=dt*1.1;const t=Math.min(a.t,1);
   a.m.position.lerpVectors(a.f,new THREE.Vector3(b.position.x,1.5,b.position.z),t);a.m.position.y+=Math.sin(Math.PI*t)*3;a.m.rotation.x+=dt*9;a.m.scale.setScalar(1.7*(1-t*.6));b.scale.y=1+Math.sin(Math.PI*t)*.1;
   if(t>=1){const c=a.m.userData.cat;S.remove(a.m);items.splice(items.indexOf(a.m),1);fly.splice(i,1);b.scale.y=1;score++;$('#score').textContent=score+' SORTED';$('#meter i').style.width=Math.min(100,score/14*100)+'%';toast(CATS[c].n+' ✔ correct bin!');setTimeout(()=>spawn(keys.indexOf(c)),1200)}}
  bg.copy(dirty).lerp(clean,k);S.fog.color.copy(bg);R.setClearColor(bg);S.fog.density=.05-.028*k;smog.material.opacity=.35*(1-k);
  C.position.set(mx*2.5,2.6+Math.min(scrollY,600)*.004,8);C.lookAt(0,1.3,-10);R.render(S,C)})();
 addEventListener('resize',()=>{R.setSize(W(),H());C.aspect=W()/H();C.updateProjectionMatrix()})})();
