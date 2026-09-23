import * as T from 'three';
import {RGBELoader} from './vendor/RGBELoader.js';

// A reversible material study. Measured geometry and the default model stay intact.
export function createStudy(model,scene,renderer,ground){
 const originals=[],replacements=new Map(),loader=new T.TextureLoader();
 let ready=false,enabled=false,pending,environment;
 const background=scene.background;
 const fill=new T.PointLight('#fff1dc',3,7,2);fill.position.set(-2,4.7,0);fill.visible=false;scene.add(fill);
 const texture=async(id,key,tile,oldTile)=>{
  const t=await loader.loadAsync(`./assets/study/${id}_${key}.jpg`);
  t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  t.repeat.set(oldTile[0]/tile[0],oldTile[1]/tile[1]);
  if(key==='Diffuse')t.colorSpace=T.SRGBColorSpace;
  return t;
 };
 async function surface(original,id,tile,{wood=false,pale=false}={}){
  const m=original.clone(),old=original.userData.tile||[1,1];
  const [map,normalMap,roughnessMap]=await Promise.all(['Diffuse','nor_gl','Rough'].map(k=>texture(id,k,tile,old)));
  Object.assign(m,{map,normalMap,roughnessMap,bumpMap:null,roughness:1,envMapIntensity:.25});m.color.set('#ffffff');m.normalScale.setScalar(wood?.35:.65);
  if(wood){
   // Neutralise the source's orange varnish to approximate unfinished pale pine.
   m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float pineLuma=dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722));
    diffuseColor.rgb=mix(vec3(pineLuma),diffuseColor.rgb,${pale?'0.30':'0.60'})*${pale?'2.65':'2.30'};
   `);};m.roughnessMap=null;m.roughness=.88;m.customProgramCacheKey=()=>pale?'study-pale':'study-pine';
  }
  replacements.set(original,m);
 }
 async function load(){
  if(pending)return pending;
  pending=(async()=>{
   const {wall,lining,boards,timber,glass}=model.materials;
   await Promise.all([
    new RGBELoader().loadAsync('./assets/study/kiara_5_noon_1k.hdr').then(t=>{t.mapping=T.EquirectangularReflectionMapping;environment=t;}),
    surface(wall,'red_brick_03',[1.45,1.05]),
    surface(lining,'coated_pine_02',[1.6,.64],{wood:true}),
    surface(boards,'coated_pine_02',[1.6,.96],{wood:true,pale:true}),
    surface(timber,'coated_pine_02',[1.6,.96],{wood:true})
   ]);
   replacements.get(timber).color.set('#86705a');
   const g=glass.clone();g.color.set('#d4e3e7');g.opacity=.10;g.roughness=.08;g.metalness=.05;g.depthWrite=false;replacements.set(glass,g);
   scene.updateMatrixWorld(true);
   for(const key of ['second','ceiling','gables'])model.groups[key].traverse(mesh=>{
    if(!mesh.isMesh||!replacements.has(mesh.material))return;
    const bounds=new T.Box3().setFromObject(mesh);
    // Include surfaces that bound the pilot room; shared slabs remain single meshes.
    if(bounds.min.x>-.58||bounds.max.y<2.60)return;
    originals.push([mesh,mesh.material]);
   });
   ready=true;setEnabled(enabled);
  })().catch(error=>{pending=null;throw error;});
  return pending;
 }
 function setEnabled(value){enabled=value;if(!ready)return;for(const [mesh,original] of originals)mesh.material=value?replacements.get(original):original;fill.visible=value;scene.environment=value?environment:null;scene.background=value?environment:background;scene.backgroundBlurriness=value?.015:0;ground.visible=!value;}
 return {load,setEnabled};
}
