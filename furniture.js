import * as T from 'three';
import {pine,masonryUV} from './masonry.js?v=fireplace1';
import {W,D,LEVEL} from './model.js?v=furnish1';

// Proposed freestanding furniture in metres; no changes to measured structure.
export function furnish(model){
 const groups=[new T.Group(),new T.Group()];groups.forEach((g,i)=>model.groups[i?'second':'first'].add(g));
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.86});
 const wood=pine(.14,null,{pale:true}),black=mat('#292c2b'),olive=mat('#777a60'),cream=mat('#ddd4bc'),rust=mat('#a76649'),stone=mat('#beb7a7'),white=mat('#e9e6dc'),dark=mat('#404344');
 const fabric=(color)=>{const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,128,128);for(let i=0;i<128;i+=3){ctx.fillStyle='#ffffff19';ctx.fillRect(i,0,1,128);ctx.fillStyle='#00000015';ctx.fillRect(0,i,128,1);}const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(5,5);map.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map,roughness:1});};
 const cloth=fabric('#85836c'),linen=fabric('#d6ccad');
 const group=(floor,x,z,angle=0)=>{const g=new T.Group();g.position.set(x-W/2,floor?LEVEL+.024:.022,z-D/2);g.rotation.y=angle;groups[floor].add(g);return g;};
 function box(g,x,y,z,w,h,d,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);if(m.userData.tile)masonryUV(o);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 function cyl(g,x,y,z,r,h,m){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,24),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 function legs(g,w,d,h=.36){for(const x of [-w/2+.07,w/2-.07])for(const z of [-d/2+.07,d/2-.07])box(g,x,h/2,z,.035,h,.035,black);}
 function seat(floor,x,z,w,angle=0){const g=group(floor,x,z,angle);legs(g,w,.70,.25);box(g,0,.26,0,w,.12,.73,wood);box(g,0,.39,.03,w-.08,.18,.61,cloth);box(g,0,.65,-.29,w,.53,.13,wood);box(g,0,.66,-.20,w-.12,.38,.12,cloth);for(const side of [-1,1]){box(g,side*(w/2-.025),.51,0,.05,.10,.72,wood);}const pillow=box(g,-w*.23,.61,-.08,w>.9?.35:.26,.28,.13,floor?rust:cream);pillow.rotation.z=.12;return g;}
 function table(floor,x,z,w,d){const g=group(floor,x,z);legs(g,w,d,.40);box(g,0,.425,0,w,.05,d,wood);return g;}
 function rug(floor,x,z,w,d){const g=group(floor,x,z);box(g,0,.006,0,w,.01,d,linen);for(let i=-w/2+.08;i<w/2;i+=.1)box(g,i,.012,-d/2+.06,.015,.004,.06,black);return g;}
 function shelf(floor,x,z,w){const g=group(floor,x,z);for(const y of [.5,.94,1.38]){box(g,0,y,0,w,.025,.22,wood);for(const a of [-w/2+.08,w/2-.08])box(g,a,y-.09,-.07,.025,.18,.025,black);for(let i=0;i<Math.floor(w/.095);i++){const h=.16+(i%3)*.035;box(g,-w/2+.08+i*.08,y+.02+h/2,0,.045,h,.14,[olive,rust,cream,dark][i%4]);}}return g;}
 // Ground floor tile finish proposal, no garage changes.
 for(const [x,z,w,d] of [[5.075,3.64,3.15,3.12],[5.75,1.10,1.78,1.68],[4.07,1.10,1.12,1.68],[3.45,6.405,6.30,1.91]]){
  const g=group(0,x,z);box(g,0,-.008,0,w,.012,d,stone);
  for(let a=-w/2;a<w/2;a+=.60)box(g,a,0,0,.006,.002,d,cream);
  for(let b=-d/2;b<d/2;b+=.60)box(g,0,0,b,w,.002,.006,cream);
 }
 // Hearth seating faces toward local -x, keeping the rear extension passage open.
 seat(0,6.20,2.96,1.48,-Math.PI/2);table(0,5.57,3.82,.42,.42);
 const entry=group(0,6.33,1.12);legs(entry,.42,.95,.35);box(entry,0,.39,0,.42,.08,.95,wood);
 for(let z=-.3;z<=.3;z+=.3){box(entry,.17,1.53,z,.045,.08,.045,black);box(entry,.1,1.49,z,.16,.025,.025,black);}
 const dogs=group(0,4.04,1.10,Math.PI/2);box(dogs,0,.045,0,1.58,.09,.72,wood);for(const x of [-.40,.40]){box(dogs,x,.13,0,.73,.14,.64,cloth);box(dogs,x,.21,.29,.73,.18,.06,olive);}
 const bowls=group(0,4.43,1.67);for(const z of [-.13,.13]){cyl(bowls,0,.045,z,.10,.09,dark);cyl(bowls,0,.091,z,.077,.003,black);}
 // Reserve only: existing 68 x 103 cm hatch cannot support comfortable stairs.
 const reserve=group(0,4.73,3.68);const ghost=new T.MeshStandardMaterial({color:'#c2944e',transparent:true,opacity:.28,depthWrite:false});box(reserve,0,.014,0,.86,.018,2.90,ghost);
 for(let z=-1.35;z<1.4;z+=.23)box(reserve,0,.025,z,.83,.009,.015,rust);
 const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=128;const lc=labelCanvas.getContext('2d');lc.fillStyle='#fff7e7';lc.fillRect(0,0,512,128);lc.fillStyle='#664c24';lc.font='bold 30px sans-serif';lc.textAlign='center';lc.fillText('МІСЦЕ ДЛЯ СХОДІВ',256,49);lc.font='23px sans-serif';lc.fillText('отвір потребує перепланування',256,91);const lm=new T.MeshBasicMaterial({map:new T.CanvasTexture(labelCanvas),side:T.DoubleSide});const sign=new T.Mesh(new T.PlaneGeometry(.82,.205),lm);sign.rotation.x=-Math.PI/2;sign.position.y=.04;reserve.add(sign);
 // Straight budget kitchenette on the outer wall. No dishwasher.
 const kitchen=group(0,5.22,7.04);
 for(const x of [-.90,-.30,.30]){box(kitchen,x,.44,0,.58,.83,.60,olive);box(kitchen,x,.88,0,.60,.045,.64,wood);box(kitchen,x,.70,-.311,.18,.025,.025,black);}
 // Sink nearest shared wet-area wall; simple surface representation with mixer.
 box(kitchen,-.90,.91,0,.43,.02,.40,dark);box(kitchen,-.90,.923,0,.34,.012,.30,black);cyl(kitchen,-.90,1.06,.22,.017,.30,black);box(kitchen,-.90,1.2,.14,.034,.035,.19,black);
 box(kitchen,.30,.911,0,.49,.025,.43,black);for(const z of [-.11,.11])cyl(kitchen,.30,.928,z,.085,.008,dark);
 box(kitchen,.92,.74,0,.58,1.45,.60,white);box(kitchen,.68,.9,-.32,.025,.30,.025,black);
 for(const y of [1.42,1.83])box(kitchen,-.34,y,.12,1.74,.035,.25,wood);
 for(let i=0;i<4;i++)cyl(kitchen,-.93+i*.25,1.50,.1,.065,.12,[cream,rust,olive,white][i]);
 // Bathroom: shower at far end, WC and basin leave a central approach.
 const shower=group(0,.82,6.43);box(shower,0,.045,0,1.0,.09,1.45,white);const glass=new T.MeshStandardMaterial({color:'#adc9ca',transparent:true,opacity:.18,roughness:.12,depthWrite:false});box(shower,.50,.94,-.24,.015,1.8,.90,glass);box(shower,-.38,1.1,0,.025,1.55,.025,black);box(shower,-.26,1.85,0,.28,.025,.13,black);
 const wc=group(0,1.82,7.04);box(wc,0,.44,.21,.37,.82,.17,white);cyl(wc,0,.20,-.05,.19,.36,white);const bowl=cyl(wc,0,.41,-.08,.235,.11,white);bowl.scale.z=1.32;cyl(wc,0,.47,-.10,.145,.007,dark);
 const basin=group(0,2.79,7.10);box(basin,0,.39,0,.54,.73,.42,wood);box(basin,0,.80,0,.57,.12,.44,white);box(basin,0,.866,-.02,.38,.012,.27,dark);cyl(basin,0,.98,.16,.015,.24,black);box(basin,0,1.46,.22,.49,.61,.025,dark);
 // Upstairs: staggered compact lounge, clear western route to bedrooms/hatch.
 rug(1,5.66,2.12,1.80,2.55);seat(1,5.50,.72,1.66);seat(1,6.19,3.39,.60,Math.PI);seat(1,5.36,3.40,.60,Math.PI+.15);
 const games=table(1,5.76,2.10,.98,.60);box(games,0,.456,0,.43,.01,.38,olive);for(let x=-.18;x<.20;x+=.06)for(let z=-.15;z<.17;z+=.06)box(games,x,.463,z,.049,.003,.049,((Math.round(x*100)+Math.round(z*100))%12===0)?cream:rust);
 for(const x of [-.35,.35])cyl(games,x,.5,.20,.029,.09,cream);
 shelf(1,5.38,.37,1.50);
 // Beds run along room length; entrance areas stay clear near the partition.
 function bed(floor,x,z,w){const g=group(floor,x,z);legs(g,2.04,w,.21);box(g,0,.23,0,2.04,.16,w,wood);box(g,0,.38,0,1.98,.19,w-.04,linen);box(g,.36,.49,0,1.14,.07,w-.01,cloth);box(g,-.79,.53,0,.37,.14,w-.15,cream);box(g,-1.0,.53,0,.06,.67,w,wood);}
 bed(1,1.40,1.415,1.40);bed(1,1.40,4.02,.90);
 const trundle=group(1,1.40,4.02);box(trundle,0,.12,.46,1.91,.16,.10,wood);box(trundle,0,.12,.52,.18,.025,.025,black);
 for(const z of [2.35,4.91]){const storage=group(1,3.36,z);box(storage,0,.40,0,.80,.80,.34,wood);box(storage,0,.66,-.18,.13,.025,.025,black);}
 // Warm reading lamp with a simple homemade timber side table.
 const lamp=group(1,6.35,4.07);cyl(lamp,0,.025,0,.13,.05,black);cyl(lamp,0,.72,0,.015,1.4,black);const shade=new T.Mesh(new T.CylinderGeometry(.09,.19,.22,24,1,true),new T.MeshStandardMaterial({color:'#cfc0a0',roughness:1,side:T.DoubleSide}));shade.position.y=1.42;lamp.add(shade);const bulb=new T.PointLight('#ffd698',2.5,3,2);bulb.position.y=1.35;lamp.add(bulb);
 return {setVisible(value){groups.forEach(g=>g.visible=value);}};
}
