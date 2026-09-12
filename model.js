import * as T from 'three';

// Metres. Front edge z=0; rear edge z=5.45; house centred in world space.
export const W=6.90,D=5.45,LEVEL=2.60;
export const rooms=[
 {id:1,floor:1,name:'Гараж',area:'14,5',size:'2,92 × 4,95 м',x:1.71,z:2.725,h:2.15},
 {id:2,floor:1,name:'Кухня',area:'11,6',size:'Основна частина 3,12 × 3,23 м',x:5.08,z:3.15,h:2.35},
 {id:3,floor:2,name:'Кімната відпочинку',area:'10,6',size:'2,41 × 4,95 м, зі сходами',x:5.445,z:2.725,h:2.4},
 {id:4,floor:2,name:'Кімната відпочинку',area:'8,6',size:'3,76 × 2,30 м',x:2.13,z:1.40,h:2.4},
 {id:5,floor:2,name:'Кімната відпочинку',area:'9,0',size:'3,76 × 2,42 м',x:2.13,z:3.99,h:2.4}
];
export function makeModel(scene){
 const groups={};for(const key of ['first','second','roof','site','base','dims','roomLabels']){groups[key]=new T.Group();scene.add(groups[key]);}
 const clip=new T.Plane(new T.Vector3(0,-1,0),1.1);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.86,...extra});
 const wall=mat('#d9d5cb',{clippingPlanes:[clip],clipShadows:true});
 const white=mat('#ddd9ce',{clippingPlanes:[clip],clipShadows:true});
 const frame=mat('#464b4b',{clippingPlanes:[clip],clipShadows:true,roughness:.55});
 const glass=mat('#779196',{clippingPlanes:[clip],transparent:true,opacity:.42,roughness:.2,metalness:.2});
 const concrete=mat('#b9b5ad'),floor=mat('#d9d5cb'),roofmat=mat('#444b4e',{metalness:.25,roughness:.65}),soil=mat('#b2b59f'),metal=mat('#686d64',{clippingPlanes:[clip],clipShadows:true}),stair=mat('#bcb5a6',{clippingPlanes:[clip],clipShadows:true});
 const box=(g,x,y,z,w,h,d,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
 const houseBox=(g,x,y,z,w,h,d,m)=>box(g,x-W/2,y,z-D/2,w,h,d,m);
 const floorSlab=(g,x,z,w,d,y=0)=>houseBox(g,x,y-.10,z,w,.20,d,floor);
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
  for(const u of [a+.03,b-.03,(a+b)/2])put(u,(low+high)/2,.055,high-low,.11,frame);
  for(const v of [low+.03,high-.03])put((a+b)/2,v,b-a,.055,.11,frame);
  put((a+b)/2,low-.04,b-a+.13,.06,.34,white);
 }
 const win=(a,b,low=.85,high=2.05)=>({a,b,low,high});
 floorSlab(groups.first,3.45,2.725,W,D);
 // Ground floor: garage left, kitchen right, recessed entrance at front-right.
 wallRun(groups.first,'x',.125,0,W,0,2.35,.25,[{a:.50,b:2.93,low:0,high:2.04},win(3.65,4.53,.8,2.0),{a:5.08,b:6.34,low:0,high:2.1}]);
 wallRun(groups.first,'x',5.325,0,W,0,2.35,.25);
 wallRun(groups.first,'z',.125,.25,5.2,0,2.35,.25);
 wallRun(groups.first,'z',6.775,.25,5.2,0,2.35,.25,[{a:.52,b:1.4,low:0,high:2.10},win(2.56,3.66)]);
 wallRun(groups.first,'z',3.335,.25,5.2,0,2.35,.33);
 wallRun(groups.first,'z',4.76,.25,1.97,0,2.35,.20);
 wallRun(groups.first,'x',1.97,4.66,6.65,0,2.35,.20,[{a:5.23,b:6.13,low:0,high:2.08}]);
 window(groups.first,'x',.125,3.65,4.53,0,.8,2.0);window(groups.first,'z',6.775,2.56,3.66,0);
 houseBox(groups.first,1.715,1.02,.12,2.43,2.04,.07,frame);
 for(let y=.25;y<2.04;y+=.29)houseBox(groups.first,1.715,y,.073,2.4,.012,.012,metal);
 // Main door on the recessed inner wall; outer entry openings stay open.
 houseBox(groups.first,5.68,1.03,1.97,.85,2.06,.065,frame);
 houseBox(groups.first,5.98,.95,1.925,.025,.18,.05,concrete);
 // Ground ceiling of garage is 0.20 m lower than kitchen; visible only with full model.
 const garageCeiling=houseBox(groups.first,1.71,2.25,2.725,2.92,.20,4.95,concrete);
 // Upper slab split around actual stairwell in rear-right corner.
 floorSlab(groups.second,2.12,2.725,4.24,D,LEVEL);
 floorSlab(groups.second,5.57,1.565,2.66,3.13,LEVEL);
 floorSlab(groups.second,6.30,4.29,1.20,2.32,LEVEL);
 wallRun(groups.second,'x',.125,0,W,LEVEL,2.4,.25,[win(1.9,3.04)]);
 wallRun(groups.second,'x',5.325,0,W,LEVEL,2.4,.25,[win(1.38,2.54),{a:5.65,b:6.40,low:0,high:2.1}]);
 wallRun(groups.second,'z',.125,.25,5.2,LEVEL,2.4,.25);
 wallRun(groups.second,'z',6.775,.25,5.2,LEVEL,2.4,.25,[win(1.05,2.19),win(3.15,4.29)]);
 wallRun(groups.second,'z',4.125,.25,5.2,LEVEL,2.4,.23,[{a:1.39,b:2.19,low:0,high:2.06},{a:3.55,b:4.35,low:0,high:2.06}]);
 wallRun(groups.second,'x',2.665,.25,4.01,LEVEL,2.4,.23);
 window(groups.second,'x',.125,1.9,3.04,LEVEL);window(groups.second,'x',5.325,1.38,2.54,LEVEL);
 window(groups.second,'z',6.775,1.05,2.19,LEVEL);window(groups.second,'z',6.775,3.15,4.29,LEVEL);
 // Opening at rear of upper hall is present in supplied plan. No balcony invented.
 const guard=houseBox(groups.second,6.025,LEVEL+.52,5.35,.75,1.04,.035,frame);
 // Indicative quarter-turn stairs correspond to stair locations in both plans.
 for(let i=0;i<9;i++)houseBox(groups.first,4.04,(i+1)*.173/2,3.05+i*.23,.90,(i+1)*.173,.23,stair);
 houseBox(groups.first,4.04,.78,5.0,.9,1.56,.40,stair);
 for(let i=0;i<6;i++)houseBox(groups.first,4.48+i*.19,(1.56+(i+1)*.173)/2,4.76,.19,1.56+(i+1)*.173,.88,stair);
 // Upper stair opening guardrail, clipped together with walls in inspection mode.
 for(let z=3.2;z<=4.7;z+=.3)houseBox(groups.second,5.68,LEVEL+.48,z,.035,.96,.035,frame);
 houseBox(groups.second,5.68,LEVEL+.97,3.95,.045,.05,1.65,frame);
 // Simple gable roof, explicitly an assumption without elevation photographs.
 const roofY=5.08,ridge=6.74;
 const tri=new T.Shape();tri.moveTo(-W/2,roofY);tri.lineTo(W/2,roofY);tri.lineTo(0,ridge);tri.closePath();
 const gable=new T.ExtrudeGeometry(tri,{depth:.16,bevelEnabled:false});
 for(const z of [-D/2,D/2-.16]){const m=new T.Mesh(gable,mat('#e8e5dc'));m.position.z=z;m.castShadow=true;groups.roof.add(m);}
 const run=W/2+.3,rise=ridge-roofY+.14,slope=Math.atan2(rise,run),length=Math.hypot(run,rise);
 for(const side of [-1,1]){
  const r=box(groups.roof,side*run/2,roofY+rise/2,0,length,.13,D+.65,roofmat);r.rotation.z=-side*slope;
  for(let z=-D/2-.27;z<D/2+.30;z+=.34){const seam=box(groups.roof,side*run/2,roofY+rise/2+.078,z,length,.025,.018,roofmat);seam.rotation.z=-side*slope;}
  box(groups.roof,side*run,roofY-.05,0,.14,.16,D+.72,roofmat);
  box(groups.roof,side*(W/2+.12),2.58,D/2+.12,.09,5.0,.09,roofmat);
 }
 box(groups.roof,0,ridge+.08,0,.15,.10,D+.70,roofmat);
 // Foundation and neutral paving; no decorative garden or interior styling.
 houseBox(groups.base,3.45,-.26,2.725,7.03,.30,5.58,concrete);
 houseBox(groups.base,3.45,-.43,2.725,8.25,.12,6.8,mat('#d5d1c8'));
 houseBox(groups.base,5.62,-.25,-.32,1.95,.30,.65,concrete);
 houseBox(groups.base,5.62,-.36,-.68,2.10,.14,.35,concrete);
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
 function dimension(a,b,text,site=false){const pts=[new T.Vector3(...a),new T.Vector3(...b)];const line=new T.Line(new T.BufferGeometry().setFromPoints(pts),lineMat);line.userData.site=site;groups.dims.add(line);const vec=new T.Vector3().subVectors(pts[1],pts[0]).normalize(),side=new T.Vector3(-vec.z,0,vec.x).multiplyScalar(.12);for(const p of pts){const tick=new T.Line(new T.BufferGeometry().setFromPoints([p.clone().sub(side),p.clone().add(side)]),lineMat);tick.userData.site=site;groups.dims.add(tick);}addLabel(text,[(a[0]+b[0])/2,(a[1]+b[1])/2+.12,(a[2]+b[2])/2],site?'site-dim':'dimension');}
 dimension([-3.45,.05,-3.65],[3.45,.05,-3.65],'6,90 м');dimension([4.25,.05,-2.725],[4.25,.05,2.725],'5,45 м');
 dimension([-5.1,-.35,-6.25],[16.23,-.35,-6.25],'21,33 м',true);dimension([16.85,-.35,-5.3],[15.95,-.35,23.82],'29,12 м',true);dimension([-4.51,-.35,24.72],[15.31,-.35,24.62],'19,82 м',true);dimension([-5.95,-.35,-5.3],[-5.36,-.35,23.92],'29,22 м',true);
 for(const r of rooms)addLabel(`<b>${r.id} · ${r.floor===2?'Кімната':r.name}</b><span>${r.area} м²</span>`,[r.x-W/2,r.floor===1?.10:LEVEL+.10,r.z-D/2],'room',r.floor);
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
  group.traverse(o=>{if(!o.isMesh||!o.visible||o.geometry.type!=='BoxGeometry')return;const {width,height:h,depth}=o.geometry.parameters;const min=o.position.y-h/2,max=o.position.y+h/2;
   if(min<height&&max>height){const cap=new T.Mesh(new T.PlaneGeometry(width,depth),capMat);cap.rotation.x=-Math.PI/2;cap.position.set(o.position.x,height+.002,o.position.z);caps.add(cap);}
  });
 }
 return {groups,clip,labels,garageCeiling,rooms,updateCaps};
}

