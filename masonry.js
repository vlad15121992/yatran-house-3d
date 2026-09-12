import * as T from 'three';

// Procedural masonry keeps courses at real-world scale on every wall segment.
export function masonry(kind,clip){
 const c=document.createElement('canvas');c.width=1024;c.height=600;
 const ctx=c.getContext('2d');let seed=kind==='brick'?38:96;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const brick=kind==='brick',rows=brick?8:2,cols=brick?4:2;
 ctx.fillStyle=brick?'#887d6b':'#9c9d94';ctx.fillRect(0,0,1024,600);
 const w=1024/cols,h=600/rows;
 for(let row=0;row<rows;row++)for(let col=-1;col<=cols;col++){
  const x=col*w+(row%2?w/2:0),y=row*h,j=brick?5:3;
  ctx.fillStyle=brick?`hsl(${16+rand()*9} ${29+rand()*16}% ${40+rand()*17}%)`:`hsl(52 5% ${74+rand()*12}%)`;
  ctx.fillRect(x+j,y+j,w-j*2,h-j*2);
  for(let k=0;k<(brick?100:600);k++){const v=rand();ctx.fillStyle=v>.5?'#ffffff17':'#241b1620';ctx.fillRect(x+j+rand()*(w-j*2),y+j+rand()*(h-j*2),1+rand()*5,1+rand()*2);}
  if(brick&&rand()<.25){ctx.fillStyle='#c7b59455';ctx.fillRect(x+j,y+h*.4,w*.6,h*.17);}
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
  uv.setXY(i,horizontal/tile[0],(pos.getY(i)+mesh.position.y)/tile[1]);
 }
 uv.needsUpdate=true;
}
