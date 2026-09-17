import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {makeModel,rooms,W,D,LEVEL} from './model.js?v=beams240';
import {planSVG} from './plans.js?v=beams240';

const $=id=>document.getElementById(id),canvas=$('scene');
const scene=new T.Scene();scene.background=new T.Color('#f6f4ef');const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});}catch(error){$('loading').textContent='3D недоступне у цьому браузері. Спробуйте браузер із підтримкою WebGL.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.localClippingEnabled=true;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const camera=new T.PerspectiveCamera(37,1,.025,300);camera.position.set(13,9,-17);
const controls=new OrbitControls(camera,canvas);controls.target.set(0,2.45,0);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=.05;controls.maxDistance=95;controls.maxPolarAngle=Math.PI/2-.01;controls.autoRotateSpeed=.7;
scene.add(new T.HemisphereLight('#fffaf0','#a4aaa5',1.7));
const sun=new T.DirectionalLight('#fff3de',2.5);sun.position.set(-9,15,-10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-20;sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);
const ground=new T.Mesh(new T.PlaneGeometry(500,500),new T.MeshStandardMaterial({color:'#f6f4ef',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.59;ground.receiveShadow=true;scene.add(ground);
const model=makeModel(scene);let current='house',plan=false,selected=null,tween=null,inside=false;
const title={house:'01 / ЗАГАЛЬНИЙ ВИГЛЯД',first:'02 / ПЕРШИЙ ПОВЕРХ',second:'03 / ДРУГИЙ ПОВЕРХ',site:'04 / ДІЛЯНКА'};
const labelEntries=model.labels.map(l=>{const el=document.createElement('div');el.className=`label ${l.kind==='room'?'room-label':l.kind==='site'?'site-label':''}`;el.innerHTML=l.text;$('labels').append(el);return {...l,el};});
function fly(pos,target){if(reducedMotion){camera.position.set(...pos);controls.target.set(...target);tween=null;return;}tween={from:camera.position.clone(),to:new T.Vector3(...pos),fromTarget:controls.target.clone(),toTarget:new T.Vector3(...target),start:performance.now()};}
controls.addEventListener('start',()=>{tween=null;});
function defaultCamera(){const mobile=innerWidth<700;if(current==='site')fly(mobile?[50,53,-67]:[32,35,-40],[-5,0,9]);else if(current==='first')fly(mobile?[-15,18,19]:[-10,13,14],[0,.4,1.1]);else if(current==='second')fly(mobile?[-15,20,19]:[-10,15,14],[0,3.0,1.1]);else fly(mobile?[-24,10,15]:[-17,7,11],[0,2.6,1.05]);}
function apply(){
 const floorMode=current==='first'||current==='second';
 controls.enabled=!inside&&!plan;controls.enableZoom=true;camera.fov=inside?70:37;camera.updateProjectionMatrix();
 model.groups.first.visible=inside||current!=='second';model.groups.second.visible=inside||current!=='first';model.groups.roof.visible=inside||(!floorMode&&$('roof').checked);
 model.groups.site.visible=current==='site';model.groups.base.visible=current!=='second';
 model.groups.ceiling.visible=inside||(current==='house'&&$('roof').checked)||(current==='second'&&$('ceiling').checked);
 model.groups.gables.visible=model.groups.roof.visible||model.groups.ceiling.visible;
 controls.minDistance=.05;controls.maxPolarAngle=Math.PI-.01;
 model.clip.constant=$('cut').checked?(current==='second'?LEVEL+1.05:1.05):100;
 model.garageCeiling.visible=(inside||!floorMode)&&!$('cut').checked;
 model.kitchenCeiling.visible=model.garageCeiling.visible;
 model.updateCaps(model.clip.constant,current);
 model.groups.dims.visible=$('dimensions').checked;
 model.groups.dims.children.forEach(m=>m.visible=!m.userData.site||current==='site');
 controls.autoRotate=$('spin').checked&&!plan&&!inside;
 $('roof').disabled=floorMode||inside;$('cut').disabled=current==='site';$('spin').disabled=inside;$('walk').checked=inside;$('walk-controls').hidden=!inside||plan;
 $('hint').textContent=plan?'Натисніть «3D огляд», щоб повернутися до моделі':inside?'Перетягніть — озирнутись · Коліщатко — вперед / назад · WASD — рух':'Перетягніть — обертання · Коліщатко — наближення та прохід усередину';
 const visibleRooms=current==='second'?rooms.filter(r=>r.floor===2):current==='first'?rooms.filter(r=>r.floor===1):rooms;
 $('room-list').innerHTML=visibleRooms.map(r=>`<button class="room" data-room="${r.id}"><span>${r.extension?r.name:r.id+' · '+r.name}</span><span>${r.area?r.area+' м²':'Увійти'}</span></button>`).join('');
 $('room-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>focusRoom(Number(b.dataset.room))));
 $('view-title').textContent=inside?(selected?(rooms.find(r=>r.id===selected)?.extension?rooms.find(r=>r.id===selected).name:'КІМНАТА '+selected)+' / ЗСЕРЕДИНИ':'ОГЛЯД ЗСЕРЕДИНИ'):title[current];$('plan-content').innerHTML=planSVG(current);
 $('snapshot').disabled=plan;$('top').disabled=plan;
}
function setView(view){inside=false;current=view;selected=null;$('ceiling').checked=false;$('room-info').hidden=true;$('cut').checked=view==='first'||view==='second';document.querySelectorAll('.view').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));});apply();defaultCamera();}
function show3D(){plan=false;$('plan-view').hidden=true;$('viewport').classList.remove('plan-mode');$('plan').setAttribute('aria-pressed','false');$('plan').textContent='План 2D';}
function enterInside(){inside=true;show3D();$('cut').checked=false;$('spin').checked=false;apply();}
function focusRoom(id){
 const r=rooms.find(r=>r.id===id);if(!r)return;
 setView(r.floor===1?'first':'second');selected=id;enterInside();canvas.focus({preventScroll:true});
 // Eye-level viewpoints in clear floor space, away from walls and the upper floor opening.
 const views={1:[1.71,4.30,1.71,1.1],2:[5.90,2.67,3.70,2.67],3:[4.40,2.725,6.65,2.725],4:[1.3,1.20,4.05,2.12],5:[1.3,4.25,4.05,3.38],6:[5.9,6.415,3.3,6.415],7:[2.65,6.05,1.7,7.3]};
 const [x,z,tx,tz]=views[id],y=(r.floor===2?LEVEL:0)+1.60;
 fly([W/2-x,y,z-D/2],[W/2-tx,id===2?1.15:y,tz-D/2]);
 $('room-info').hidden=false;$('room-info').innerHTML=`<b>${r.extension?r.name:r.id+' · '+r.name+' · '+r.area+' м²'}</b>${r.size}<br><small>Камера всередині · висота погляду 1,60 м</small>`;
}
function moveInside(distance,sideways=0){
 tween=null;const direction=camera.getWorldDirection(new T.Vector3()),right=new T.Vector3().crossVectors(direction,camera.up).normalize();
 const delta=direction.multiplyScalar(distance).addScaledVector(right,sideways);camera.position.add(delta);controls.target.add(delta);
}
// Wheel advances the camera and can pass the former orbit centre instead of hitting a zoom limit.
canvas.addEventListener('wheel',e=>{
 if(plan)return;e.preventDefault();e.stopImmediatePropagation();tween=null;
 const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?canvas.clientHeight:1);
 if(inside){moveInside(-T.MathUtils.clamp(delta*.004,-.65,.65));return;}
 const direction=camera.getWorldDirection(new T.Vector3()),distance=camera.position.distanceTo(controls.target);
 const step=T.MathUtils.clamp(-delta*.0015*distance,-5,5);
 camera.position.addScaledVector(direction,step);
 if(step>0&&distance-step<1.5){controls.target.copy(camera.position).add(direction);enterInside();}
 else controls.update();
},{passive:false,capture:true});
let lookDrag=null;
canvas.addEventListener('pointerdown',e=>{if(!inside||plan||e.button!==0||lookDrag)return;tween=null;canvas.focus({preventScroll:true});lookDrag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!inside||!lookDrag||lookDrag.id!==e.pointerId)return;
 const dx=e.clientX-lookDrag.x,dy=e.clientY-lookDrag.y;lookDrag.x=e.clientX;lookDrag.y=e.clientY;
 const angles=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ');angles.y-=dx*.004;angles.x=T.MathUtils.clamp(angles.x-dy*.004,-Math.PI/2+.03,Math.PI/2-.03);angles.z=0;camera.quaternion.setFromEuler(angles);
 controls.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()));
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{lookDrag=null;});
canvas.addEventListener('keydown',e=>{if(!inside||plan)return;const key=e.code;const moves={KeyW:[.25,0],ArrowUp:[.25,0],KeyS:[-.25,0],ArrowDown:[-.25,0],KeyA:[0,-.25],ArrowLeft:[0,-.25],KeyD:[0,.25],ArrowRight:[0,.25]};if(moves[key]){e.preventDefault();moveInside(...moves[key]);}});
$('walk-forward').addEventListener('click',()=>moveInside(.35));$('walk-back').addEventListener('click',()=>moveInside(-.35));
$('walk').addEventListener('change',()=>{if($('walk').checked){tween=null;enterInside();controls.target.copy(camera.position).add(camera.getWorldDirection(new T.Vector3()));}else{inside=false;selected=null;$('room-info').hidden=true;apply();defaultCamera();}});

document.querySelectorAll('.view').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
['roof','dimensions','cut','spin'].forEach(id=>$(id).addEventListener('change',()=>{if(id==='cut'&&$('cut').checked){inside=false;selected=null;$('room-info').hidden=true;defaultCamera();}if(id==='cut'&&$('cut').checked&&current==='house'){setView('first');return;}apply();}));
$('ceiling').addEventListener('change',()=>{const enabled=$('ceiling').checked;if(enabled){if(current!=='second')setView('second');$('ceiling').checked=true;selected=null;enterInside();fly([-2.02,4.0,2.18],[-2.02,4.5,-1.65]);}else{inside=false;apply();defaultCamera();}});
$('reset').addEventListener('click',()=>{inside=false;selected=null;$('room-info').hidden=true;$('spin').checked=false;$('ceiling').checked=false;$('cut').checked=current==='first'||current==='second';apply();defaultCamera();});
$('top').addEventListener('click',()=>{inside=false;selected=null;$('room-info').hidden=true;$('ceiling').checked=false;$('cut').checked=current==='first'||current==='second';apply();const site=current==='site',y=current==='second'?LEVEL:0;fly(site?[-5,49,9.01]:[0,y+22,-.001],site?[-5,0,9]:[0,y,0]);});
$('plan').addEventListener('click',()=>{plan=!plan;if(plan){inside=false;selected=null;$('room-info').hidden=true;}if(plan&&current==='house')setView('first');$('plan-view').hidden=!plan;$('viewport').classList.toggle('plan-mode',plan);$('plan').setAttribute('aria-pressed',String(plan));$('plan').textContent=plan?'3D огляд':'План 2D';$('hint').textContent=plan?'Натисніть «3D огляд», щоб повернутися до моделі':innerWidth<700?'Один палець — обертання · Два — масштаб':'Перетягніть, щоб обертати · Коліщатко — масштаб';apply();});
$('details').addEventListener('click',()=>$('data-dialog').showModal());$('close-dialog').addEventListener('click',()=>$('data-dialog').close());$('data-dialog').addEventListener('click',e=>{if(e.target===$('data-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('snapshot').addEventListener('click',()=>{renderer.render(scene,camera);const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download=`yatran-${current}.png`;a.click();});
function resize(){const rect=$('viewport').getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe($('viewport'));
function animate(now){requestAnimationFrame(animate);if(tween){const t=Math.min((now-tween.start)/750,1),e=1-Math.pow(1-t,3);camera.position.lerpVectors(tween.from,tween.to,e);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,e);if(t===1)tween=null;}if(inside)camera.lookAt(controls.target);else controls.update();renderer.render(scene,camera);
 const width=canvas.clientWidth,height=canvas.clientHeight;
 for(const l of labelEntries){const show=!plan&&((l.kind==='dimension'&&$('dimensions').checked)||(l.kind==='site-dim'&&$('dimensions').checked&&current==='site')||(l.kind==='site'&&current==='site')||(l.kind==='room'&&$('cut').checked&&((current==='first'&&l.floor===1)||(current==='second'&&l.floor===2))));l.el.hidden=!show;if(show){const p=l.point.clone().project(camera);l.el.hidden=p.z>1||p.z< -1||Math.abs(p.x)>1||Math.abs(p.y)>1;l.el.style.left=`${(p.x*.5+.5)*width}px`;l.el.style.top=`${(-p.y*.5+.5)*height}px`;}}
}
apply();resize();defaultCamera();requestAnimationFrame(animate);$('loading').hidden=true;if(innerWidth<700)$('hint').textContent='Один палець — обертання · Два — масштаб';
