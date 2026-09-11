const heroSlides=[
 {slot:'Frühstück',src:'breakfast.webp',name:'Spiegelei auf Sauerteigbrot',description:'Kirschtomaten, Spinat und frische Kräuter.'},
 {slot:'Mittag',src:'steak.webp',name:'Steak mit Kartoffeln',description:'Ein sättigender Teller, mit etwas Grünem dazu.'},
 {slot:'Abend',src:'stroganoff.webp',name:'Hähnchen-Stroganoff',description:'Nudeln und eine cremige Pilzsauce.'},
 {slot:'Snack',src:'snack.webp',name:'Banane & dunkle Schokolade',description:'Eine Kleinigkeit zwischendurch.'}
];
const heroCarousel=document.querySelector('.hero-art');
heroCarousel.setAttribute('role','region');heroCarousel.setAttribute('aria-roledescription','Karussell');heroCarousel.setAttribute('aria-label','Mahlzeiten im Tagesverlauf');
const heroImage=heroCarousel.querySelector('img'),heroCaption=heroCarousel.querySelector('.food-caption');
heroCaption.setAttribute('aria-live','polite');heroCaption.setAttribute('aria-atomic','true');
const heroControls=document.createElement('div');heroControls.className='hero-carousel-controls';
heroControls.innerHTML='<button class="hero-prev" aria-label="Vorherige Mahlzeit">←</button><div class="hero-meal-dots">'+heroSlides.map((s,i)=>`<button data-slide="${i}" aria-label="${s.slot} anzeigen" aria-pressed="${i===0}"><span aria-hidden="true"></span>${s.slot}</button>`).join('')+'</div><button class="hero-next" aria-label="Nächste Mahlzeit">→</button>';
heroCarousel.append(heroControls);
let heroIndex=0;
function showHeroSlide(index){
 heroIndex=(index+heroSlides.length)%heroSlides.length;const slide=heroSlides[heroIndex];
 heroImage.src='../assets/'+slide.src;heroImage.alt=slide.name+'. '+slide.description;
 heroCaption.innerHTML=`<span>${slide.slot.toUpperCase()} · ${heroIndex+1} / ${heroSlides.length}</span><strong>${slide.name}</strong><p>${slide.description}</p>`;
 heroControls.querySelectorAll('[data-slide]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.slide)===heroIndex)));
}
heroControls.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.slide!==undefined)showHeroSlide(Number(b.dataset.slide));else showHeroSlide(heroIndex+(b.classList.contains('hero-next')?1:-1));});
heroCarousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showHeroSlide(heroIndex+(e.key==='ArrowRight'?1:-1));}});
let heroTouch=null;
heroImage.addEventListener('touchstart',e=>{heroTouch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
heroImage.addEventListener('touchend',e=>{if(!heroTouch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-heroTouch.x,dy=e.changedTouches[0].clientY-heroTouch.y;heroTouch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showHeroSlide(heroIndex+(dx<0?1:-1));},{passive:true});
heroImage.addEventListener('touchcancel',()=>{heroTouch=null;});
showHeroSlide(0);
