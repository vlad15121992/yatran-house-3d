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
  return `<svg viewBox="-90 -95 900 1120" role="img" aria-label="Схематичний план ділянки"><polygon points="0,850 640,850 612,0 18,-3" fill="#e5e7d9" stroke="${stroke}" stroke-width="3"/><rect x="50" y="627" width="207" height="163.5" fill="#ccc8bc" stroke="${stroke}" stroke-width="3"/><rect x="50" y="560.1" width="207" height="66.9" fill="#d4d7d0" stroke="#393b37" stroke-width="2"/>${text(153,600,'Прибудова',12)}${text(153,708,'А · Будинок',18)}<rect x="190" y="30" width="37.5" height="42" fill="#ccc8bc" stroke="${stroke}" stroke-width="2"/>${text(209,100,'Б',15)}${text(385,400,'600 м²',36)}${text(320,890,'21,33 м',18)}${text(315,-30,'19,82 м',18)}${text(-45,430,'29,22',16)}${text(687,430,'29,12',16)}<path d="M72 850h83m35 0h27" stroke="#faf9f5" stroke-width="8"/>${text(120,933,'Ворота',15)}${text(254,933,'Хвіртка',15)}${text(450,990,'Контур і відступи — схематично',14)}</svg>`;
 }
 if(mode==='second'){
 body=outer.replace('y="25" width="640" height="495"','y="23.5" width="640" height="498"')+wall(405,23.5,23,498)+wall(25,259.5,380,26)+opening(404,152.5,25,80)+opening(404,309.5,25,80)+window(189.5,521.5,115,23.5)+window(138.5,0,115,23.5)+window(665,316.5,25,140)+window(665,97.5,25,140)+opening(565,-2,75,29);
 body+='<rect x="337" y="233.5" width="68" height="26" fill="#c2a375" stroke="#735c40" stroke-width="1.5"/><rect x="332" y="285.5" width="73" height="23" fill="#c2a375" stroke="#735c40" stroke-width="1.5"/>'+text(367,247,'68 × 26',9)+text(365,300,'73 × 23',9);
 body+=room(210,150,'5 · Гостьова спальня','8,97')+room(210,400,'4 · Спальня','8,97')+room(545,265,'3 · Вітальня','10,6');
 body+=`<rect x="428" y="25" width="103" height="68" fill="#dfdace" stroke="#393b37" stroke-dasharray="7 4"/>`+text(475,56,'Отвір',11)+text(475,77,'103 × 68 см',10);
 body+=text(210,213,'3,80 × 2,36 м',13)+text(210,236,'h = 2,35–3,10 м',12)+text(210,467,'3,80 × 2,36 м',13)+text(210,491,'h = 2,35–3,10 м',12)+text(550,339,'h = 2,40 м',13);
 }else{
 body=outer+wall(317,25,33,495)+wall(466,348,20,172)+wall(466,338,199,20)+opening(523,336,90,24)+opening(50,518,243,29)+opening(508,518,126,29)+opening(663,383,29,110)+window(365,520,88,25)+window(665,141,25,110);
 body+='<rect x="350" y="221" width="65" height="114" fill="#b2a190" stroke="#605247" stroke-width="2"/><rect x="350" y="256" width="46" height="44" fill="none" stroke="#605247" stroke-dasharray="4 3"/><rect x="407" y="217" width="8" height="4" fill="#171b1d"/><rect x="407" y="335" width="8" height="4" fill="#171b1d"/>'+text(382.5,275,'Камін',11)+text(382.5,291,'114 × 65',9);
 body+=opening(555,-2,80,29)+text(592,48,'Прохід ≈ 80 см',11);
 body+=room(172,267,'1 · Гараж','14,5')+room(510,229,'2 · Камінна','11,6');body+=text(172,339,'2,92 × 4,95 м',13)+text(172,362,'h = 2,15 м',13)+text(516,281,'h = 2,20 м',13)+text(570,439,'Вхід',15);
 body+=`<rect x="428" y="25" width="103" height="68" fill="none" stroke="#8b8172" stroke-dasharray="5 4"/>`+text(475,65,'Отвір у стелі',10);

 }
 const extension=mode==='second'?`<rect x="0" y="-223" width="690" height="223" fill="#dedbd2" stroke="${stroke}" stroke-width="2"/>${text(345,-136,'ТЕРАСА НАД ПРИБУДОВОЮ',18)}${text(345,-100,'6,90 × 2,23 м · соснова дошка 14 см',14)}`:`<rect x="0" y="-223" width="690" height="223" fill="#d4d7d0" stroke="${stroke}" stroke-width="2"/><rect x="30" y="-193" width="630" height="193" fill="#fafaf5" stroke="${stroke}" stroke-width="2"/><rect x="328.5" y="-193" width="10" height="193" fill="#97bda9" stroke="${stroke}" stroke-width="2"/>${opening(327.5,-136.5,12,80)}${window(166,-223,50,30)}${window(660,-90,30,50)}${text(180,-130,'ТУАЛЕТ',17)}${text(180,-104,'Вікно 50 × 60 см',12)}${text(495,-130,'КУХНЯ · ПРИБУДОВА',15)}${text(495,-103,'Гіпсокартон · прохід ≈ 80 см',11)}${text(345,-245,'Вікно: 166 см від правого кута зовні',12)}`;

 return `<svg viewBox="-45 -275 840 980" role="img" aria-label="План ${mode==='second'?'другого':'першого'} поверху з прибудовою">${extension}${body}${dims}${text(345,655,mode==='second'?'2 ПОВЕРХ · 28,2 м² + тераса':'1 ПОВЕРХ · 26,1 м² + прибудова',17)}</svg>`;
}
