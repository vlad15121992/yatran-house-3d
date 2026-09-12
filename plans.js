const stroke='#393b37',fill='#f6f4ef';
export function planSVG(mode){
 const outer='<rect x="0" y="0" width="690" height="545" fill="#e8e5dc" stroke="#393b37" stroke-width="4"/><rect x="25" y="25" width="640" height="495" fill="#fbfaf7" stroke="#393b37" stroke-width="2"/>';
 const text=(x,y,s,size=16)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${stroke}" font-family="Consolas,monospace" font-size="${size}">${s}</text>`;
 const room=(x,y,n,a)=>text(x,y,n,16)+text(x,y+27,a+' м²',18);
 const wall=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d8d5cb" stroke="${stroke}" stroke-width="2"/>`;
 const opening=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fbfaf7"/>`;
 const window=(x,y,w,h)=>opening(x,y,w,h)+`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#526d74" stroke-width="2"/><path d="M${x+w/2} ${y}v${h}" stroke="#526d74"/>`;
 const dims=`<path d="M0 565v35m690-35v35M0 585h690M710 0h35m-35 545h35M730 0v545" fill="none" stroke="#aaa69c"/>${text(345,578,'6,90 м',15)}<text transform="translate(752 273) rotate(-90)" text-anchor="middle" font-size="15" fill="#777">5,45 м</text>`;
 let body='';
 if(mode==='site'){
  return `<svg viewBox="-90 -95 900 1120" role="img" aria-label="Схематичний план ділянки"><polygon points="0,850 640,850 612,0 18,-3" fill="#e5e7d9" stroke="${stroke}" stroke-width="3"/><rect x="50" y="627" width="207" height="163.5" fill="#ccc8bc" stroke="${stroke}" stroke-width="3"/>${text(153,708,'А · Будинок',18)}<rect x="190" y="30" width="37.5" height="42" fill="#ccc8bc" stroke="${stroke}" stroke-width="2"/>${text(209,100,'Б',15)}${text(385,400,'600 м²',36)}${text(320,890,'21,33 м',18)}${text(315,-30,'19,82 м',18)}${text(-45,430,'29,22',16)}${text(687,430,'29,12',16)}<path d="M72 850h83m35 0h27" stroke="#faf9f5" stroke-width="8"/>${text(120,933,'Ворота',15)}${text(254,933,'Хвіртка',15)}${text(450,990,'Контур і відступи — схематично',14)}</svg>`;
 }
 if(mode==='second'){
 body=outer+wall(401,25,23,495)+wall(25,267,376,23)+opening(400,139,25,80)+opening(400,355,25,80)+window(190,520,114,25)+window(138,0,116,25)+window(665,301,25,114)+window(665,101,25,114)+opening(565,-2,75,29);
 body+=room(210,150,'5 · Кімната відпочинку','9,0')+room(210,400,'4 · Кімната відпочинку','8,6')+room(545,265,'3 · Кімната','10,6');
 body+=`<rect x="430" y="27" width="132" height="170" fill="#dfdace" stroke="${stroke}"/>`;for(let i=0;i<10;i++)body+=`<path d="M430 ${30+i*16}h132" stroke="#888"/>`;
 body+=text(210,213,'3,76 × 2,42 м',13)+text(210,467,'3,76 × 2,30 м',13)+text(550,339,'h = 2,40 м',13);
 }else{
 body=outer+wall(317,25,33,495)+wall(466,348,20,172)+wall(466,338,199,20)+opening(523,336,90,24)+opening(50,518,243,29)+opening(508,518,126,29)+opening(663,405,29,88)+window(365,520,88,25)+window(665,179,25,110);
 body+=room(172,267,'1 · Гараж','14,5')+room(510,229,'2 · Кухня','11,6');body+=text(172,339,'2,92 × 4,95 м',13)+text(172,362,'h = 2,15 м',13)+text(516,281,'h = 2,35 м',13)+text(570,439,'Вхід',15);
 body+=`<path d="M352 25h195v88h-106v132h-89z" fill="#dfdace" stroke="${stroke}"/>`;for(let i=0;i<8;i++)body+=`<path d="M352 ${118+i*16}h89" stroke="#888"/>`;for(let i=0;i<6;i++)body+=`<path d="M${441+i*18} 25v88" stroke="#888"/>`;
 }
 return `<svg viewBox="-45 -55 840 715" role="img" aria-label="План ${mode==='second'?'другого':'першого'} поверху">${body}${dims}${text(345,660,mode==='second'?'2 ПОВЕРХ · 28,2 м²':'1 ПОВЕРХ · 26,1 м²',17)}</svg>`;
}
