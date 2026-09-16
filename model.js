import * as T from 'three';
import {masonry,masonryUV,pine} from './masonry.js';

// Metres. Front edge z=0; rear edge z=5.45; house centred in world space.
export const W=6.90,D=5.45,LEVEL=2.60,EXT=2.23,TERRACE=2.85;
// Owner dimensions: finished terrace top, and side window measured from brick junction/top.
export const HATCH={x:4.24,z:4.52,width:1.03,depth:.68};
export const KITCHEN_HEIGHT=2.20;
export const PASSAGE={a:5.55,b:6.35,height:2.05}; // 0.80 m wide; 0.30 m from right inner corner. Height estimated from photo.
export const extensionWindow={a:D+.40,b:D+.90,low:TERRACE-.60-.60,high:TERRACE-.60};
// Partition follows the red mark: continuation of the main ground-floor dividing wall.
export const PARTITION={x:3.335,thickness:.10,doorWidth:.80,doorHeight:2.05};
// Rear elevation: right external corner is local x=0 after the model mirror.
export const toiletWindow={a:1.66,b:2.16,low:TERRACE-.60-.60,high:TERRACE-.60}; // Owner confirmed same height as the side window.
export const rooms=[
 {id:1,floor:1,name:'Гараж',area:'14,5',size:'2,92 × 4,95 м',x:1.71,z:2.725,h:2.15},
 {id:2,floor:1,name:'Кухня',area:'11,6',size:'Основна частина 3,12 × 3,23 м',x:5.08,z:3.15,h:KITCHEN_HEIGHT},
 {id:3,floor:2,name:'Кімната відпочинку',area:'10,6',size:'2,41 × 4,95 м, з отвором у підлозі',x:5.445,z:2.725,h:2.4},
 {id:4,floor:2,name:'Кімната відпочинку',area:'8,6',size:'3,76 × 2,30 м',x:2.13,z:1.40,h:2.4},
 {id:5,floor:2,name:'Кімната відпочинку',area:'9,0',size:'3,76 × 2,42 м',x:2.13,z:3.99,h:2.4},
 {id:6,floor:1,name:'Кухня · прибудова',area:null,extension:true,size:'Гіпсокартонна перегородка з проходом до туалету',x:5.0,z:6.42,h:2.62},
 {id:7,floor:1,name:'Туалет · прибудова',area:null,extension:true,size:'Вікно 50 × 60 см · чорна рама',x:1.8,z:6.42,h:2.62}

];
export function makeModel(scene){
 const groups={};for(const key of ['first','second','roof','ceiling','gables','site','base','dims','roomLabels']){groups[key]=new T.Group();scene.add(groups[key]);}
 const clip=new T.Plane(new T.Vector3(0,-1,0),1.1);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.86,...extra});
 const wall=masonry('brick',clip),block=masonry('block',clip);
 const drywall=mat('#97bda9',{clippingPlanes:[clip],clipShadows:true}),joint=mat('#7f9e8e',{clippingPlanes:[clip],clipShadows:true});
 const white=mat('#ddd9ce',{clippingPlanes:[clip],clipShadows:true});
 const frame=mat('#151919',{clippingPlanes:[clip],clipShadows:true,roughness:.55});
 const glass=mat('#779196',{clippingPlanes:[clip],transparent:true,opacity:.42,roughness:.2,metalness:.2});
 const concrete=mat('#b9b5ad'),floor=mat('#d9d5cb'),roofmat=mat('#444b4e',{metalness:.25,roughness:.65}),soil=mat('#b2b59f'),metal=mat('#686d64',{clippingPlanes:[clip],clipShadows:true}),stair=mat('#bcb5a6',{clippingPlanes:[clip],clipShadows:true});
 const lining=pine(.08,clip),boards=pine(.12,clip,{pale:true}),deck=pine(.14,clip,{pale:true});
 const timber=mat('#927044'),sheet=mat('#15191b',{metalness:.35,roughness:.82});
 const box=(g,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);masonryUV(o);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const houseBox=(g,x,y,z,w,h,d,m)=>box(g,x-W/2,y,z-D/2,w,h,d,m);
 const floorSlab=(g,x,z,w,d,y=0)=>{houseBox(g,x,y-.10,z,w,.20,d,floor);if(g===groups.second)houseBox(g,x,y+.012,z,w,.024,d,boards);};
 // Openings are modelled as actual voids, never painted onto solid walls.
 function wallRun(g,axis,fixed,start,end,y,h,t,openings=[],m=wall){
  const cuts=[start,end,...openings.flatMap(o=>[o.a,o.b])].filter(v=>v>=start&&v<=end).sort((a,b)=>a-b);
  for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1];if(b-a<.001)continue;const o=openings.find(o=>(a+b)/2>o.a&&(a+b)/2<o.b);
   const part=(bottom,top)=>{if(top<=bottom)return;axis==='x'?houseBox(g,(a+b)/2,y+(bottom+top)/2,fixed,b-a,top-bottom,t,m):houseBox(g,fixed,y+(bottom+top)/2,(a+b)/2,t,top-bottom,b-a,m);};
   if(o){part(0,o.low);part(o.high,h);}else part(0,h);
  }
 }
 function window(g,axis,fixed,a,b,y,low=.85,high=2.05){
  const put=(u,v,w,h,dep,m)=>axis==='x'?houseBox(g,u,y+v,fixed,w,h,dep,m):houseBox(g,fixed,y+v,u,dep,h,w,m);
  put((a+b)/2,(low+high)/2,b-a,high-low,.045,glass);
  for(const u of [a+.03,b-.03])put(u,(low+high)/2,.055,high-low,.11,frame);
  for(const v of [low+.03,high-.03])put((a+b)/2,v,b-a,.055,.11,frame);
  put((a+b)/2,low-.04,b-a+.13,.06,.34,white);
 }
 const win=(a,b,low=.85,high=2.05)=>({a,b,low,high});
 function archPath(path,a,b,low,spring,high){path.moveTo(a,low);path.lineTo(b,low);path.lineTo(b,spring);path.absellipse((a+b)/2,spring,(b-a)/2,high-spring,0,Math.PI,false);path.lineTo(a,low);path.closePath();}
 function sideFacade(g,level,openings){
  const shape=new T.Shape();shape.moveTo(.25,0);shape.lineTo(D-.25,0);shape.lineTo(D-.25,2.4);shape.lineTo(.25,2.4);shape.closePath();
  for(const o of openings){const hole=new T.Path();if(o.arch)archPath(hole,o.a,o.b,o.low,o.spring,o.high);else{hole.moveTo(o.a,o.low);hole.lineTo(o.b,o.low);hole.lineTo(o.b,o.high);hole.lineTo(o.a,o.high);hole.closePath();}shape.holes.push(hole);}
  const geo=new T.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:false,curveSegments:24});geo.rotateY(-Math.PI/2);
  const mesh=new T.Mesh(geo,wall);mesh.position.set(W/2,level,-D/2);mesh.userData.sideOpenings=openings;masonryUV(mesh);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
 }
 function archDetail(g,o,level,glazed){
  const cx=W/2+.018,mid=(o.a+o.b)/2-D/2,rx=(o.b-o.a)/2,ry=o.high-o.spring;
  const points=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI;points.push(new T.Vector3(cx,level+o.spring+Math.sin(a)*ry,mid+Math.cos(a)*rx));}
  if(glazed){
   const paneShape=new T.Shape();archPath(paneShape,o.a,o.b,o.low,o.spring,o.high);
   const geo=new T.ShapeGeometry(paneShape);geo.rotateY(-Math.PI/2);const pane=new T.Mesh(geo,glass);pane.material.side=T.DoubleSide;pane.position.set(W/2-.035,level,-D/2);g.add(pane);
   const curved=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),40,.032,6,false),frame);g.add(curved);
   for(const z of [o.a+.025,o.b-.025])houseBox(g,W-.015,level+(o.low+o.spring)/2,z,.09,o.spring-o.low,.055,frame);
   for(const y of [o.low+.025])houseBox(g,W-.015,level+y,(o.a+o.b)/2,.09,.055,o.b-o.a,frame);

  }
  const archBrick=mat('#a5684e',{clippingPlanes:[clip],clipShadows:true});
  for(let i=0;i<15;i++){const a=(i+.5)/15*Math.PI;const brick=box(g,cx,level+o.spring+Math.sin(a)*(ry+.115),mid+Math.cos(a)*(rx+.115),.11,.215,.115,archBrick);brick.rotation.x=Math.PI/2-a;}
 }
 floorSlab(groups.first,3.45,2.725,W,D);
 // Ground floor: garage left, kitchen right, recessed entrance at front-right.
 wallRun(groups.first,'x',.125,0,W,0,2.35,.25,[{a:.50,b:2.93,low:0,high:2.04},win(3.65,4.53,.8,2.0),{a:5.08,b:6.34,low:0,high:2.1}]);
 // Rough knocked-through rear brick wall: irregular exposed jambs, no door/frame.
 for(let row=0;row<25;row++){
  const y=row*PASSAGE.height/25,h=PASSAGE.height/25;
  const left=PASSAGE.a-[.012,.032,0,.021,.008][row%5],right=PASSAGE.b+[.019,0,.026,.009][row%4];
  wallRun(groups.first,'x',5.325,0,W,y,h,.25,[{a:left,b:right,low:0,high:h}]);
 }
 houseBox(groups.first,W/2,(PASSAGE.height+2.35)/2,5.325,W,2.35-PASSAGE.height,.25,wall);
 for(let i=0;i<8;i++){const chip=[.024,.008,.034,.013][i%4];houseBox(groups.first,PASSAGE.a+(i+.5)*.10,PASSAGE.height-chip/2,5.325,.10,chip,.25,wall);}
 wallRun(groups.first,'z',.125,.25,5.2,0,2.35,.25);
 const entrance={a:.52,b:1.62,low:0,spring:1.61,high:2.10,arch:true};
 sideFacade(groups.first,0,[entrance,win(2.94,4.04,.78,1.95)]);archDetail(groups.first,entrance,0,false);
 wallRun(groups.first,'z',3.335,.25,5.2,0,2.35,.33);
 wallRun(groups.first,'z',4.76,.25,1.97,0,2.35,.20);
 wallRun(groups.first,'x',1.97,4.66,6.65,0,2.35,.20,[{a:5.23,b:6.13,low:0,high:2.08}]);
 window(groups.first,'x',.125,3.65,4.53,0,.8,2.0);window(groups.first,'z',6.775,2.94,4.04,0,.78,1.95);
 houseBox(groups.first,1.715,1.02,.12,2.43,2.04,.07,frame);
 for(let y=.25;y<2.04;y+=.29)houseBox(groups.first,1.715,y,.073,2.4,.012,.012,metal);
 // Main door on the recessed inner wall; outer entry openings stay open.
 houseBox(groups.first,5.68,1.03,1.97,.85,2.06,.065,frame);
 houseBox(groups.first,5.98,.95,1.925,.025,.18,.05,concrete);
 // Ground ceiling of garage is 0.20 m lower than kitchen; visible only with full model.
 const garageCeiling=houseBox(groups.first,1.71,2.25,2.725,2.92,.20,4.95,concrete);
 // Four slab strips share the same 103 × 68 cm void as the kitchen ceiling.
 function aroundHatch(x0,x1,z0,z1,put){
  const hx=HATCH.x,hz=HATCH.z,ex=hx+HATCH.width,ez=hz+HATCH.depth;
  for(const [a,b,c,d] of [[x0,hx,z0,z1],[ex,x1,z0,z1],[hx,ex,z0,hz],[hx,ex,ez,z1]])
   if(b>a&&d>c)put((a+b)/2,(c+d)/2,b-a,d-c);
 }
 aroundHatch(0,W,0,D,(x,z,w,d)=>floorSlab(groups.second,x,z,w,d,LEVEL));
 const kitchenCeiling=new T.Group();groups.first.add(kitchenCeiling);
 const ceilingPatch=(x,z,w,d)=>houseBox(kitchenCeiling,x,KITCHEN_HEIGHT+.015,z,w,.03,d,lining);
 aroundHatch(3.50,6.65,1.97,5.20,ceilingPatch);
 ceilingPatch((3.50+4.66)/2,(.25+1.97)/2,4.66-3.50,1.97-.25);
 // Exposed timber edges outside the clear opening; no stairs or invented guardrail.
 houseBox(kitchenCeiling,HATCH.x-.03,(KITCHEN_HEIGHT+LEVEL)/2,HATCH.z+HATCH.depth/2,.06,LEVEL-KITCHEN_HEIGHT,HATCH.depth,timber);
 houseBox(kitchenCeiling,HATCH.x+HATCH.width+.03,(KITCHEN_HEIGHT+LEVEL)/2,HATCH.z+HATCH.depth/2,.06,LEVEL-KITCHEN_HEIGHT,HATCH.depth,timber);
 houseBox(kitchenCeiling,HATCH.x+HATCH.width/2,(KITCHEN_HEIGHT+LEVEL)/2,HATCH.z-.03,HATCH.width+.06,LEVEL-KITCHEN_HEIGHT,.06,timber);
 // The photographed brickwork continues across the floor line without a white band.
 houseBox(groups.second,W/2,2.475,.12,W,.25,.26,wall);
 houseBox(groups.second,W/2,2.475,D-.12,W,.25,.26,wall);
 houseBox(groups.second,.12,2.475,D/2,.26,.25,D,wall);
 houseBox(groups.second,W-.12,2.475,D/2,.26,.25,D,wall);
 wallRun(groups.second,'x',.125,0,W,LEVEL,2.4,.25,[win(1.9,3.04)]);
 wallRun(groups.second,'x',5.325,0,W,LEVEL,2.4,.25,[win(1.38,2.54),{a:5.65,b:6.40,low:0,high:2.1}]);
 wallRun(groups.second,'z',.125,.25,5.2,LEVEL,2.4,.25);
 const upperArches=[{a:.57,b:2.04,low:.18,spring:1.92,high:2.27,arch:true},{a:2.94,b:4.41,low:.18,spring:1.92,high:2.27,arch:true}];
 sideFacade(groups.second,LEVEL,upperArches);upperArches.forEach(o=>archDetail(groups.second,o,LEVEL,true));
 wallRun(groups.second,'z',4.125,.25,5.2,LEVEL,2.4,.23,[{a:1.39,b:2.19,low:0,high:2.06},{a:3.55,b:4.35,low:0,high:2.06}],lining);
 wallRun(groups.second,'x',2.665,.25,4.01,LEVEL,2.4,.23,[],lining);
 window(groups.second,'x',.125,1.9,3.04,LEVEL);window(groups.second,'x',5.325,1.38,2.54,LEVEL);
 // Upper doorway faces the terrace. Existing house floor datum remains provisional.
 // First-floor stairs removed at owner request. Existing upper opening remains.
 // Photo shows gable at the 5.45 m end: ridge runs along the 6.90 m axis.
 // Both roof pitches are visual estimates, not survey measurements.
 const roofY=5.02,ridge=5.83,ridgeZ=2.55;
 // Pine-lined ceiling follows both slopes; exposed beams remain below the lining.
 for(const [a,b,ya,yb] of [[.25,ridgeZ,5.01,5.69],[ridgeZ,D-.25,5.69,5.01]]){
  const len=Math.hypot(b-a,yb-ya),angle=-Math.atan2(yb-ya,b-a);
  const panel=houseBox(groups.ceiling,W/2,(ya+yb)/2,(a+b)/2,W-.25,.035,len,lining);panel.rotation.x=angle;
  for(const x of [1.15,2.65,4.15,5.65]){const beam=houseBox(groups.ceiling,x,(ya+yb)/2-.13,(a+b)/2,.14,.20,len,timber);beam.rotation.x=angle;}
 }
 // Continue the internal timber partitions up to the roof-shaped ceiling.
 const partition=new T.Shape();partition.moveTo(.25,5.0);partition.lineTo(D-.25,5.0);partition.lineTo(ridgeZ,5.68);partition.closePath();
 const pg=new T.ExtrudeGeometry(partition,{depth:.23,bevelEnabled:false});pg.rotateY(-Math.PI/2);
 const pm=new T.Mesh(pg,lining);pm.position.set(4.24-W/2,0,-D/2);masonryUV(pm);groups.ceiling.add(pm);
 houseBox(groups.ceiling,2.13,5.32,2.665,3.76,.64,.23,lining);
 const tri=new T.Shape();tri.moveTo(0,roofY);tri.lineTo(D,roofY);tri.lineTo(ridgeZ,ridge);tri.closePath();
 const vent=new T.Path();vent.absellipse(ridgeZ,5.42,.105,.105,0,Math.PI*2);tri.holes.push(vent);
 for(const x of [.16,W]){const geo=new T.ExtrudeGeometry(tri,{depth:.16,bevelEnabled:false});geo.rotateY(-Math.PI/2);const m=new T.Mesh(geo,wall);m.position.set(x-W/2,0,-D/2);masonryUV(m);m.castShadow=true;groups.gables.add(m);}
 const ventRing=new T.Mesh(new T.TorusGeometry(.12,.026,8,28),mat('#8a9290'));ventRing.rotation.y=Math.PI/2;ventRing.position.set(W/2+.02,5.42,ridgeZ-D/2);groups.roof.add(ventRing);
 const flue=new T.Mesh(new T.CylinderGeometry(.065,.065,3.35,12),sheet);flue.position.set(W/2+.09,3.28,-D/2+.03);groups.roof.add(flue);
 for(const [a,b,ya,yb] of [[-.13,ridgeZ,4.98,ridge],[ridgeZ,D+.13,ridge,4.98]]){
  const dz=b-a,dy=yb-ya,len=Math.hypot(dz,dy),angle=-Math.atan2(dy,dz);
  const r=houseBox(groups.roof,W/2,(ya+yb)/2+.04,(a+b)/2,W+.22,.065,len,sheet);r.rotation.x=angle;
  for(let x=-.08;x<W+.12;x+=.14){const corrugation=houseBox(groups.roof,x,(ya+yb)/2+.075,(a+b)/2,.038,.026,len,sheet);corrugation.rotation.x=angle;}
 }
 // Permanent AAC extension, confirmed behind the upper exterior doorway.
 floorSlab(groups.first,W/2,D+EXT/2,W,EXT);
 wallRun(groups.first,'x',D+EXT-.15,0,W,0,TERRACE-.23,.30,[toiletWindow],block);
 window(groups.first,'x',D+EXT-.15,toiletWindow.a,toiletWindow.b,0,toiletWindow.low,toiletWindow.high);
 wallRun(groups.first,'z',.15,D,D+EXT-.30,0,TERRACE-.23,.30,[],block);
 wallRun(groups.first,'z',W-.15,D,D+EXT-.30,0,TERRACE-.23,.30,[extensionWindow],block);
 window(groups.first,'z',W-.15,extensionWindow.a,extensionWindow.b,0,extensionWindow.low,extensionWindow.high);
 // Unfinished green plasterboard partition, open door, no door leaf or fixtures.
 const doorCentre=D+(EXT-.30)/2,doorA=doorCentre-PARTITION.doorWidth/2,doorB=doorCentre+PARTITION.doorWidth/2;
 wallRun(groups.first,'z',PARTITION.x,D,D+EXT-.30,0,TERRACE-.23,PARTITION.thickness,[{a:doorA,b:doorB,low:0,high:PARTITION.doorHeight}],drywall);
 for(const side of [-1,1]){
  const face=PARTITION.x+side*(PARTITION.thickness/2+.002);
  for(const z of [doorA-.02,doorB+.02]){
   houseBox(groups.first,face,(TERRACE-.23)/2,z,.004,TERRACE-.23,.006,joint);
   for(let y=.18;y<TERRACE-.3;y+=.28)houseBox(groups.first,face+side*.003,y,z,.003,.010,.010,frame);
  }
 }

 houseBox(groups.second,W/2,TERRACE-.13,D+EXT/2,W,.20,EXT,concrete);
 houseBox(groups.second,W/2,TERRACE-.015,D+EXT/2,W,.03,EXT,deck);
 houseBox(groups.base,W/2,-.25,D+EXT/2,W+.06,.30,EXT+.06,concrete);
 // Terrace is unfinished: exposed structural timber, no decorative balustrade.
 const innerY=5.05,outerY=4.82,canopyDepth=EXT+.20;
 for(const x of [.12,2.34,4.56,W-.12])houseBox(groups.roof,x,(TERRACE+outerY)/2,D+EXT-.10,.14,outerY-TERRACE,.14,timber);
 houseBox(groups.roof,W/2,outerY-.03,D+EXT-.10,W+.2,.19,.16,timber);
 houseBox(groups.roof,W/2,innerY-.08,D+.06,W+.1,.18,.13,timber);
 const canopySlope=Math.atan2(innerY-outerY,canopyDepth),canopyLen=Math.hypot(canopyDepth,innerY-outerY);
 for(let x=.08;x<W;x+=.55){const beam=houseBox(groups.roof,x,(innerY+outerY)/2-.025,D+canopyDepth/2,.085,.17,canopyLen,timber);beam.rotation.x=canopySlope;}
 const canopy=houseBox(groups.roof,W/2,(innerY+outerY)/2+.085,D+canopyDepth/2,W+.28,.035,canopyLen,sheet);canopy.rotation.x=canopySlope;
 for(let x=-.10;x<W+.12;x+=.14){const rib=houseBox(groups.roof,x,(innerY+outerY)/2+.11,D+canopyDepth/2,.035,.025,canopyLen,sheet);rib.rotation.x=canopySlope;}
 // Foundation and neutral paving; no decorative garden or interior styling.
 houseBox(groups.base,3.45,-.26,2.725,7.03,.30,5.58,concrete);
 // Bare footing instead of a finished paved apron.
 // Site: published side lengths constrain an approximate trapezoid only.
 const siteShape=new T.Shape();siteShape.moveTo(-5.10,-5.3);siteShape.lineTo(16.23,-5.3);siteShape.lineTo(15.31,23.82);siteShape.lineTo(-4.51,23.92);siteShape.closePath();
 const geo=new T.ShapeGeometry(siteShape);geo.rotateX(Math.PI/2);
 const ground=new T.Mesh(geo,mat('#c5c8b4',{side:T.DoubleSide}));ground.position.y=-.51;ground.receiveShadow=true;groups.site.add(ground);
 const corners=[[-5.10,-5.3],[16.23,-5.3],[15.31,23.82],[-4.51,23.92]];
 function fence(a,b,gap=false){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/1.8);for(let i=0;i<=n;i++){const t=i/n,x=a[0]+dx*t,z=a[1]+dz*t;if(gap&&x>-3.1&&x<3.4)continue;box(groups.site,x,.13,z,.065,1.3,.065,metal);}for(const yy of [.0,.65]){if(gap){for(const [p,q] of [[a[0],-3.1],[3.4,b[0]]])box(groups.site,(p+q)/2,yy,a[1],q-p,.04,.04,metal);}else{const rail=box(groups.site,(a[0]+b[0])/2,yy,(a[1]+b[1])/2,len,.04,.04,metal);rail.rotation.y=-Math.atan2(dz,dx);}}}
 corners.forEach((p,i)=>fence(p,corners[(i+1)%4],i===0));
 box(groups.site,-1.72,.15,-5.3,2.76,1.25,.055,metal);box(groups.site,2.66,.15,-5.3,.9,1.25,.055,metal);
 box(groups.site,-1.72,-.49,-4.32,3.0,.045,2.0,mat('#c2c0b5'));
 // Outdoor toilet Б: position read schematically from site drawing.
 box(groups.site,1.9,.55,22.2,1.25,2.1,1.40,mat('#d4cec0'));box(groups.site,1.9,1.68,22.2,1.45,.15,1.62,roofmat);box(groups.site,1.9,.42,21.49,.65,1.8,.035,frame);
 const labels=[];
 function addLabel(text,p,kind='dimension',floorNo=0){labels.push({text,point:new T.Vector3(...p),kind,floor:floorNo});}
 const lineMat=new T.LineBasicMaterial({color:'#8e8a7f'});
 function dimension(a,b,text,site=false){const pts=[new T.Vector3(...a),new T.Vector3(...b)];const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),lineMat);line.userData.site=site;groups.dims.add(line);const vec=new T.Vector3().subVectors(pts[1],pts[0]).normalize(),side=(Math.abs(vec.y)>.99?new T.Vector3(0,0,1):new T.Vector3(-vec.z,0,vec.x)).multiplyScalar(.12);for(const p of pts){const tick=new T.Line(new T.BufferGeometry().setFromPoints([p.clone().sub(side),p.clone().add(side)]),lineMat);tick.userData.site=site;groups.dims.add(tick);}addLabel(text,[(a[0]+b[0])/2,(a[1]+b[1])/2+.12,(a[2]+b[2])/2],site?'site-dim':'dimension');}
 dimension([-3.45,.05,-3.65],[3.45,.05,-3.65],'6,90 м');dimension([4.25,.05,-2.725],[4.25,.05,2.725],'5,45 м');
 dimension([4.25,.05,D/2],[4.25,.05,D/2+EXT],'2,23 м · прибудова');
 dimension([4.25,0,D/2+EXT],[4.25,TERRACE,D/2+EXT],'2,85 м · до підлоги тераси');
 addLabel('<b>Тераса</b><span>Соснова дошка · 14 см</span>',[0,TERRACE+.10,D/2+EXT/2],'room',2);
 dimension([-5.1,-.35,-6.25],[16.23,-.35,-6.25],'21,33 м',true);dimension([16.85,-.35,-5.3],[15.95,-.35,23.82],'29,12 м',true);dimension([-4.51,-.35,24.72],[15.31,-.35,24.62],'19,82 м',true);dimension([-5.95,-.35,-5.3],[-5.36,-.35,23.92],'29,22 м',true);
 for(const r of rooms)addLabel(`<b>${r.extension?r.name:r.id+' · '+(r.floor===2?'Кімната':r.name)}</b><span>${r.area?r.area+' м²':'Прибудова'}</span>`,[r.x-W/2,r.floor===1?.10:LEVEL+.10,r.z-D/2],'room',r.floor);
 addLabel('<b>Ділянка · 600 м²</b>',[5.3,-.20,11.0],'site');addLabel('Б · Вбиральня',[1.9,2.1,22.2],'site');addLabel('Проїзд',[7,-.20,-7.5],'site');
 // Mirrored world X keeps plan-left on the viewer's left when facing the entrance.
 for(const g of Object.values(groups))g.scale.x=-1;
 for(const l of labels)l.point.x*=-1;
 const caps=new T.Group();caps.scale.x=-1;scene.add(caps);
 const capMat=mat('#918b7c');
 function updateCaps(height,active){
  while(caps.children.length){const c=caps.children[0];caps.remove(c);c.geometry.dispose();}
  if(height>10)return;
  const group=groups[active];if(!group)return;
  group.traverse(o=>{if(!o.isMesh||!o.visible)return;
   if(o.userData.sideOpenings){
    const y=height-o.position.y;if(y<=0||y>=2.4)return;
    const intervals=o.userData.sideOpenings.filter(a=>y>a.low&&y<a.high).map(a=>{let half=(a.b-a.a)/2;if(a.arch&&y>a.spring)half*=Math.sqrt(1-Math.pow((y-a.spring)/(a.high-a.spring),2));return [(a.a+a.b)/2-half,(a.a+a.b)/2+half];});
    const cuts=[.25,D-.25,...intervals.flat()].sort((a,b)=>a-b);
    for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1];if(intervals.some(v=>(a+b)/2>v[0]&&(a+b)/2<v[1]))continue;const cap=new T.Mesh(new T.PlaneGeometry(.25,b-a),capMat);cap.rotation.x=-Math.PI/2;cap.position.set(W/2-.125,height+.002,(a+b)/2-D/2);caps.add(cap);}return;
   }
   if(o.geometry.type!=='BoxGeometry')return;const {width,height:h,depth}=o.geometry.parameters;const min=o.position.y-h/2,max=o.position.y+h/2;
   if(min<height&&max>height){const cap=new T.Mesh(new T.PlaneGeometry(width,depth),capMat);cap.rotation.x=-Math.PI/2;cap.position.set(o.position.x,height+.002,o.position.z);caps.add(cap);}
  });
 }
 return {groups,clip,labels,garageCeiling,kitchenCeiling,rooms,updateCaps};
}



