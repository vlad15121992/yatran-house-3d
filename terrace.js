import * as T from 'three';
import {pine,masonryUV} from './masonry.js?v=fireplace1';
import {W,D,EXT,TERRACE} from './model.js?v=oakstairs2';

// Concept only: grade, footing, timber sections and anchorage need site verification.
export const ACCESS={ground:-.27,top:TERRACE,risers:20,going:.27,width:1.0,guard:1.10,maxGap:.075,landing:1.20};
export function terraceAccess(scene){
 const group=new T.Group();group.scale.x=-1;scene.add(group);
 const wood=pine(.14,null,{pale:true}),metal=new T.MeshStandardMaterial({color:'#292e2b',roughness:.7}),concrete=new T.MeshStandardMaterial({color:'#a6a297',roughness:1});
 wood.color.set('#91613b');
 let reverseFlight=false;const reflectZ=z=>2*(D+EXT-.10)-1.20-z;
 const B=(x,y,z,w,h,d,m=wood)=>{if(reverseFlight)z=reflectZ(z);const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x-W/2,y,z-D/2);if(m.userData.tile)masonryUV(o);o.castShadow=o.receiveShadow=true;group.add(o);return o;};
 const beam=(a,b,w,d,m=wood)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av),mid=av.clone().add(bv).multiplyScalar(.5);const o=B(mid.x,mid.y,mid.z,w,v.length(),d,m);if(reverseFlight)v.z=-v.z;o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;};
 function rail(a,b,y=TERRACE){
  const length=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(length/1.15),dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length;
  for(let j=0;j<=n;j++){const t=j/n;B(a[0]+(b[0]-a[0])*t,y+.55,a[1]+(b[1]-a[1])*t,.09,1.10,.09);}
  beam([a[0],y+1.075,a[1]],[b[0],y+1.075,b[1]],.075,.075);
  // Only top and low bottom rails, with vertical infill; clear bottom gap 45 mm.
  beam([a[0],y+.075,a[1]],[b[0],y+.075,b[1]],.06,.055);
  const count=Math.ceil(length/(ACCESS.maxGap+.045));
  for(let j=0;j<count;j++){const t=(j+.5)*length/count;B(a[0]+dx*t,y+.565,a[1]+dz*t,.045,.93,.045);}
 }
 const edge=D+EXT-.10,g0=6.40,g1=7.40,gateX=.045;
 rail([.10,edge],[W-.10,edge]);rail([W-.10,D+.04],[W-.10,edge]);
 rail([.045,D+.04],[.045,g0]);rail([.045,g1],[.045,edge]);
 // Closed timber gate at the terrace end. Opens inward onto the terrace in practice.
 B(gateX,TERRACE+.075,(g0+g1)/2,.065,.06,.90);B(gateX,TERRACE+1.075,(g0+g1)/2,.065,.05,.90);
 for(const z of [g0+.05,g1-.05])B(gateX,TERRACE+.575,z,.065,1.05,.065);
 for(let z=g0+.13;z<g1-.08;z+=.105)B(gateX,TERRACE+.565,z,.045,.93,.045);
 for(const y of [.22,.85])B(-.001,TERRACE+y,g0+.025,.025,.065,.14,metal);
 B(.092,TERRACE+1.04,g1-.07,.03,.10,.11,metal);
 // Reflect only landing/flight about the landing centre: descend toward front yard (-z).
 reverseFlight=true;
 const start=edge,cx=-.60,rise=(TERRACE-ACCESS.ground)/ACCESS.risers,run=(ACCESS.risers-1)*ACCESS.going,end=start+run;
 B(cx,TERRACE-.035,start-.60,1.20,.07,1.20);
 for(const x of [-1.10,-.10])for(const z of [start-1.10,start-.10]){B(x,(TERRACE+ACCESS.ground)/2,z,.12,TERRACE-ACCESS.ground,.12);B(x,ACCESS.ground-.065,z,.32,.13,.32,concrete);}
 for(const x of [-1.10,-.10])B(x,TERRACE-.15,start-.60,.12,.23,1.20);
 for(const z of [start-1.10,start-.10])beam([-1.10,TERRACE-.85,z],[-.45,TERRACE-.15,z],.075,.075);
 rail([-1.15,start-1.15],[-.045,start-1.15]);rail([-1.15,start-1.15],[-1.15,start]);
 // Closed risers avoid the open triangular gaps of ladder-style exterior steps.
 for(let i=0;i<ACCESS.risers-1;i++){
  const z=start+(i+.5)*ACCESS.going,y=TERRACE-(i+1)*rise;
  B(cx,y-.024,z,ACCESS.width,.048,ACCESS.going+.015);
  B(cx,y+rise/2,start+i*ACCESS.going,ACCESS.width,rise,.024);
 }
 B(cx,ACCESS.ground+rise/2,end,ACCESS.width,rise,.025);
 for(const x of [cx-.47,cx+.47])beam([x,TERRACE-.15,start],[x,ACCESS.ground+.04,end],.095,.24);
 B(cx,ACCESS.ground-.065,end+.45,1.34,.13,.95,concrete);
 for(const x of [cx-.55,cx+.55]){
  
  beam([x,TERRACE+1.075,start],[x,ACCESS.ground+rise+1.075,end],.07,.07);
  beam([x,TERRACE+.07,start],[x,ACCESS.ground+rise+.07,end],.055,.055);
  const count=Math.ceil(run/.11);
  for(let i=0;i<=count;i++){const z=start+run*i/count;const top=TERRACE+1.05-(z-start)/run*(TERRACE-ACCESS.ground-rise);const stepY=TERRACE-Math.min(19,Math.floor((z-start)/ACCESS.going)+1)*rise;B(x,(top+stepY+.04)/2,z,.045,top-stepY-.04,.045);}
  for(let i=0;i<=4;i++){const z=start+run*i/4,base=i===4?ACCESS.ground:TERRACE-Math.max(1,Math.ceil((z-start)/ACCESS.going))*rise;const top=TERRACE+1.10-(z-start)/run*(TERRACE-ACCESS.ground-rise);B(x,(base+top)/2,z,.09,top-base,.09);}
 }
 return group;
}
