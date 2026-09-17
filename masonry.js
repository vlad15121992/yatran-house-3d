import * as T from 'three';

// Procedural masonry keeps courses at real-world scale on every wall segment.
export function masonry(kind,clip){
 const c=document.createElement('canvas');c.width=1024;c.height=600;
 const ctx=c.getContext('2d');let seed=kind==='brick'?38:96;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const brick=kind!=='block',reclaimed=kind==='reclaimed',rows=brick?8:2,cols=brick?4:2;
 ctx.fillStyle=brick?'#887d6b':'#9c9d94';ctx.fillRect(0,0,1024,600);
 const w=1024/cols,h=600/rows;
 for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){
  const x=col*w+(row%2?w/2:0),y=row*h,j=brick?5:3;
  ctx.fillStyle=reclaimed?`hsl(${20+rand()*9} ${12+rand()*15}% ${49+rand()*18}%)`:brick?`hsl(${16+rand()*9} ${29+rand()*16}% ${40+rand()*17}%)`:`hsl(52 5% ${74+rand()*12}%)`;
  ctx.fillRect(x+j,y+j,w-j*2,h-j*2);
  for(let k=0;k<(brick?100:600);k++){const v=rand();ctx.fillStyle=v>.5?'#ffffff17':'#241b1620';ctx.fillRect(x+j+rand()*(w-j*2),y+j+rand()*(h-j*2),1+rand()*5,1+rand()*2);}
  if(brick&&rand()<.25){ctx.fillStyle='#c7b59455';ctx.fillRect(x+j,y+h*.4,w*.6,h*.17);}
  if(reclaimed){
   // Irregular old mortar remnants: exposed brick rather than a finished mantel.
   for(let k=0;k<3;k++){const px=x+rand()*w,py=y+rand()*h,r=35+rand()*85;ctx.fillStyle=rand()>.35?'#aaa69899':'#888b7e66';ctx.beginPath();for(let n=0;n<9;n++){const angle=n/9*Math.PI*2,rr=r*(.65+rand()*.35);const xx=px+Math.cos(angle)*rr,yy=py+Math.sin(angle)*rr*.55;n?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.fill();}
  }
 }
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 const material=new T.MeshStandardMaterial({color:'#ffffff',map,bumpMap:map,bumpScale:brick?.015:.006,roughness:1,clippingPlanes:[clip],clipShadows:true});
 material.userData.tile=brick?[1.04,.60]:[1.20,.50];
 return material;
}
export function masonryUV(mesh){
 const tile=mesh.material.userData.tile;if(!tile)return;
 const pos=mesh.geometry.attributes.position,norm=mesh.geometry.attributes.normal,uv=mesh.geometry.attributes.uv;
 for(let i=0;i<pos.count;i++){
  const horizontal=Math.abs(norm.getX(i))>.5?pos.getZ(i)+mesh.position.z:pos.getX(i)+mesh.position.x;
  const vertical=Math.abs(norm.getY(i))>.5?pos.getZ(i)+mesh.position.z:pos.getY(i)+mesh.position.y;
  uv.setXY(i,horizontal/tile[0],vertical/tile[1]);
 }
 uv.needsUpdate=true;
}
export function pine(width,clip,{pale=false}={}){
 const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');let seed=123;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let b=0;b<4;b++){
  const y=b*128;ctx.fillStyle=`hsl(35 ${pale?35:48}% ${pale?68+rand()*7:57+rand()*10}%)`;ctx.fillRect(0,y,1024,128);
  for(let i=0;i<65;i++){ctx.beginPath();ctx.strokeStyle=`rgba(104,65,27,${.04+rand()*.10})`;ctx.lineWidth=.5+rand();const yy=y+rand()*126;ctx.moveTo(0,yy);ctx.bezierCurveTo(270,yy-12,690,yy+12,1024,yy);ctx.stroke();}
  for(let k=0;k<3;k++){const x=50+rand()*920,yy=y+20+rand()*85;for(let r=5;r>0;r--){ctx.beginPath();ctx.ellipse(x,yy,r*7,r*1.8,0,0,Math.PI*2);ctx.strokeStyle='#75502d55';ctx.stroke();}ctx.fillStyle='#624222';ctx.beginPath();ctx.ellipse(x,yy,6,3,0,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#6e4e3055';ctx.fillRect(0,y,1024,2);ctx.fillStyle='#fff6d438';ctx.fillRect(0,y+2,1024,1);
 }
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 const material=new T.MeshStandardMaterial({map,roughness:.9,bumpMap:map,bumpScale:.002,clippingPlanes:clip?[clip]:[],clipShadows:true});material.userData.tile=[1.6,width*4];return material;
}
