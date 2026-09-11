// Beispielhafter Ablauf für Frühstück, Mittag- und Abendessen. Keine Kontodaten, keine echten Einkäufe.
const demoMeals={
 eggs:{name:'Spiegelei auf Sauerteigbrot',image:'breakfast.webp',kcal:389,protein:21,items:[['Sauerteigbrot',70,500,2.8],['Eier (essbarer Anteil)',100,300,2.4],['Kirschtomaten',100,250,1.8],['Spinat',30,200,1.5],['Olivenöl',5,450,5.5],['Petersilie',3,30,.9],['Schwarzer Pfeffer',.2,50,1.2]]},
 steak:{name:'Steak mit Kartoffeln und Spinat',image:'steak.webp',kcal:569,protein:43,items:[['Rindersteak (roh)',160,300,6],['Kartoffeln',220,1000,2],['Spinat',100,200,1.5],['Olivenöl',8,450,5.5],['Petersilie',3,30,.9],['Schwarzer Pfeffer',.2,50,1.2]]},
 stroganoff:{name:'Hähnchen-Stroganoff mit Nudeln',image:'stroganoff.webp',kcal:632,protein:54,items:[['Hähnchenbrust (roh)',180,600,5.4],['Nudeln (trocken)',65,500,1.4],['Champignons',100,250,1.8],['Zwiebel',40,500,1],['Soja-Kochcreme',70,200,1.5,'ml'],['Olivenöl',5,450,5.5],['Petersilie',3,30,.9],['Schwarzer Pfeffer',.2,50,1.2]]},
 salmon:{name:'Lachs mit Kartoffeln und Spinat',image:'salmon.webp',kcal:608,protein:40,items:[['Lachsfilet (roh)',150,300,5.9],['Kartoffeln',280,1000,2],['Spinat',150,200,1.5],['Olivenöl',5,450,5.5],['Petersilie',3,30,.9],['Schwarzer Pfeffer',.2,50,1.2]]},
 teriyaki:{name:'Teriyaki-Nudeln mit Tofu',image:'teriyaki.webp',kcal:686,protein:47,items:[['Naturtofu',200,400,2.5],['Nudeln (trocken)',70,500,1.4],['Brokkoli',150,500,1.9],['Karotten',100,1000,1.5],['Olivenöl',5,450,5.5],['Teriyaki-Marinade',15,250,2.5,'ml'],['Petersilie',3,30,.9],['Schwarzer Pfeffer',.2,50,1.2]]},
 oats:{name:'Overnight Oats mit Banane',image:'oats.webp',kcal:453,protein:13,items:[['Haferflocken',80,500,1.4],['Banane',120,600,1.5],['Beeren',100,250,2.2]]}
};
const demoState={step:0,people:1,meal:'eggs',lunch:'steak',dinner:'salmon',pantry:false,calorieTarget:1500,proteinTarget:100};
function demoBasket(state){
 const combined=new Map();
 for(const meal of [demoMeals[state.meal],demoMeals[state.lunch],demoMeals[state.dinner]])for(const [name,amount,size,price,unit='g'] of meal.items){const row=combined.get(name)||{name,needed:0,size,price,unit};row.needed+=amount*state.people;combined.set(name,row);}
 return [...combined.values()].map((r,index)=>{const needed=Math.round(r.needed*100)/100,used=state.pantry&&index===0?needed:0,packs=Math.ceil((needed-used)/r.size);return {...r,needed,used,packs,cost:packs*r.price,left:Math.round((packs*r.size-(needed-used))*100)/100};});
}
const demo=document.createElement('section');demo.id='planning-demo';demo.className='planning-demo section';
demo.innerHTML=`<div class="eyebrow">AUSPROBIEREN</div><h2>Drei Mahlzeiten.<br>Ein durchdachter Einkauf.</h2><p>Triff eine Wahl. Zutaten, Einkauf und Vorrat aktualisieren sich sofort.</p><div class="demo-shell"><nav class="demo-tabs" aria-label="Schritte der Planungsdemo"><button data-step="0">01 <span>Mahlzeiten planen</span></button><button data-step="1">02 <span>Einkauf zusammenstellen</span></button><button data-step="2">03 <span>Vorrat nutzen</span></button></nav><div class="demo-goals"><div><div class="eyebrow">DEINE TAGESZIELE · PRO PERSON</div><h3>Beginne mit deinen Zielen.</h3><p>Sieh, wie Frühstück, Mittag- und Abendessen dazu beitragen. Diese Demo deckt Frühstück, Mittag- und Abendessen ab; Snacks sind Teil der App. Die Portionen bleiben hier fest.</p></div><fieldset class="goal-people"><legend>Wer isst mit?</legend><div class="demo-choice"><button data-people="1" aria-pressed="true">Nur ich</button><button data-people="2" aria-pressed="false">Zu zweit</button></div></fieldset><div class="goal-inputs"><label for="calorie-target">Kalorienziel <span>kcal / Tag</span><input id="calorie-target" type="number" min="1" max="10000" step="1" value="1500" inputmode="numeric" aria-describedby="goal-help"></label><label for="protein-target">Proteinziel <span>g / Tag</span><input id="protein-target" type="number" min="1" max="1000" step="1" value="100" inputmode="numeric" aria-describedby="goal-help"></label></div><p id="goal-help">Trage deine eigenen Tagesziele ein. In diesem Beispiel gelten dieselben Ziele für jede Person.</p><div id="goal-coverage" aria-live="polite"></div><div id="live-basket-cost" class="live-basket-cost" aria-live="polite"></div></div><div id="demo-panel"></div><div class="demo-bottom"><button class="demo-back">Zurück</button><p id="demo-progress" aria-live="polite"></p><button class="button demo-next">Zum Einkauf →</button></div></div><p class="demo-disclaimer">Interaktives Beispiel, keine echte Bestellung. Zur Vereinfachung werden hier gleiche Portionen verwendet. Nährwerte und Packungspreise sind beispielhafte Schätzungen. Es wird nichts in deinem Konto gespeichert.</p>`;
document.querySelector('.app-section').before(demo);
const euro=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n);
function renderDemo(focus){
 const s=demoState,m=demoMeals[s.meal],l=demoMeals[s.lunch],d=demoMeals[s.dinner],rows=demoBasket(s),total=rows.reduce((a,r)=>a+r.cost,0),before=demoBasket({...s,pantry:false}).reduce((a,r)=>a+r.cost,0);
 demo.querySelectorAll('[data-people]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.people)===s.people)));
 demo.querySelectorAll('[data-step]').forEach(b=>{b.setAttribute('aria-current',Number(b.dataset.step)===s.step?'step':'false');});
 const dish=(meal,slot)=>`<div class="demo-dish"><img src="../assets/${meal.image}" alt="${meal.name}" width="640" height="640" loading="lazy" decoding="async"><span>${slot} · ${s.people===1?'1 PERSON':s.people+' PERSONEN'}</span><h3>${meal.name}</h3><p>${meal.kcal} kcal · ${meal.protein} g Protein <small>pro Person</small></p></div>`;
 const picture=`<div class="demo-dish-pair">${dish(m,'FRÜHSTÜCK')}${dish(l,'MITTAGESSEN')}${dish(d,'ABENDESSEN')}</div>`;
 let content='';
 const choices=(slot,legende,options)=>`<div class="demo-controls"><fieldset><legend>${legende}</legend><div class="demo-meals">${options.map(([id,title,subtitle])=>`<button data-${slot}="${id}" aria-pressed="${s[slot]===id}">${title}<span>${subtitle}</span></button>`).join('')}</div></fieldset></div>`;
 if(s.step===0)content=`<div class="demo-selection"><div class="meal-pick-row">${dish(m,'FRÜHSTÜCK')}${choices('meal','Wähle dein Frühstück',[['eggs','Spiegelei auf Brot','Herzhaft und sättigend'],['oats','Overnight Oats mit Banane','Einfach und pflanzlich']])}</div><div class="meal-pick-row">${dish(l,'MITTAGESSEN')}${choices('lunch','Wähle dein Mittagessen',[['steak','Steak mit Kartoffeln','Spinat und frische Kräuter'],['stroganoff','Hähnchen-Stroganoff','Nudeln und cremige Pilzsauce']])}</div><div class="meal-pick-row">${dish(d,'ABENDESSEN')}${choices('dinner','Wähle dein Abendessen',[['salmon','Lachs mit Kartoffeln','Spinat und frische Kräuter'],['teriyaki','Teriyaki-Nudeln mit Tofu','Brokkoli, Karotten und Teriyaki-Sauce']])}</div><div class="demo-result" aria-live="polite"><strong>3 Mahlzeiten · ${s.people*3} Portionen geplant</strong><span>${m.kcal+l.kcal+d.kcal} kcal · ${m.protein+l.protein+d.protein} g Protein pro Person über alle drei Mahlzeiten</span></div></div>`;
 else {
 const list=rows.map(r=>`<li class="${r.used?'from-pantry':''}"><div><strong>${r.name}</strong><small>${r.needed} ${r.unit} für deine Mahlzeiten${r.used?' · aus deinem Vorrat':` · ${r.packs} × ${r.size} ${r.unit} ${r.packs===1?'Packung':'Packungen'}`}</small></div><b>${r.used?'Schon da':euro(r.cost)}</b></li>`).join('');
 content=`<div class="demo-cart"><div class="eyebrow">${s.step===1?'VOM REZEPT ZUM EINKAUF':'SCHAU, WAS SCHON DA IST'}</div><h3>${s.step===1?'Aus Zutaten wird ein Einkauf.':'Ein bisschen weniger kaufen.'}</h3><p>${s.step===1?'Zutaten, die in mehreren Mahlzeiten vorkommen, werden zusammengefasst, bevor ganze Packungen berechnet werden.':'Nutze das Brot oder die Haferflocken, die du noch zu Hause hast.'}</p>${s.step===2?`<label class="pantry-switch"><input type="checkbox" id="use-pantry" ${s.pantry?'checked':''}><span>Ich habe noch ${rows[0].needed} ${rows[0].unit} ${rows[0].name}</span></label>`:''}<ul class="demo-list">${list}</ul></div><div class="demo-side">${picture}<div class="demo-result" aria-live="polite"><span>Geschätzte Einkaufssumme · ${s.people===1?'1 Person':'2 Personen'}</span><strong class="demo-total">${euro(total)}</strong><span>${rows.reduce((a,r)=>a+r.packs,0)} Packungen zu kaufen</span>${s.step===2?`<div class="demo-saving">${s.pantry?`${euro(before-total)} weniger in diesem Beispiel`:'Setze den Haken, um den Unterschied zu sehen.'}</div>`:''}</div>${s.step===2?`<p class="demo-explain">Nach einem erledigten Einkauf lassen sich nicht verbrauchte Packungsmengen für spätere Pläne aufheben. Hier bleiben von der neuen Packung ${rows[1].name} noch ${rows[1].left} ${rows[1].unit} über diese Mahlzeiten hinaus.</p>`:''}</div>`;
 }
 demo.querySelector('#demo-panel').innerHTML=content;
 demo.querySelector('#demo-progress').textContent=`Schritt ${s.step+1} von 3`;
 demo.querySelector('.demo-back').disabled=s.step===0;
 demo.querySelector('.demo-next').textContent=['Zum Einkauf →','Vorrat prüfen →','Andere Mahlzeiten ↺'][s.step];
 demo.querySelector('#live-basket-cost').innerHTML=`<div><span>Geschätzter Einkauf · ${s.people===1?'1 Person':'2 Personen'}</span><strong>${euro(total)}</strong></div><div><span>Pro Person</span><strong>${euro(total/s.people)}</strong></div><p>${rows.reduce((n,r)=>n+r.packs,0)} ganze Packungen. Geteilte Packungen können für beide reichen, deshalb verdoppelt sich die Summe nicht zwangsläufig.</p>`;
 renderCoverage();
 if(focus)demo.querySelector(focus)?.focus({preventScroll:true});
}
demo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let focus;const previousStep=demoState.step;
 if(b.dataset.step!==undefined)demoState.step=Number(b.dataset.step);
 else if(b.dataset.people){demoState.people=Number(b.dataset.people);focus=`[data-people="${b.dataset.people}"]`;}
 else if(b.dataset.dinner){demoState.dinner=b.dataset.dinner;focus=`[data-dinner="${b.dataset.dinner}"]`;}
 else if(b.dataset.lunch){demoState.lunch=b.dataset.lunch;focus=`[data-lunch="${b.dataset.lunch}"]`;}
 else if(b.dataset.meal){demoState.meal=b.dataset.meal;demoState.pantry=false;focus=`[data-meal="${b.dataset.meal}"]`;}
 else if(b.classList.contains('demo-next')){demoState.step=(demoState.step+1)%3;}
 else if(b.classList.contains('demo-back'))demoState.step=Math.max(0,demoState.step-1);
 renderDemo(focus);
 if(demoState.step!==previousStep){
  // Fokus nicht am Ende eines anders hohen Schritts stehen lassen.
  demo.querySelector(`[data-step="${demoState.step}"]`).focus({preventScroll:true});
  requestAnimationFrame(()=>{
   const top=demo.querySelector('.demo-tabs').getBoundingClientRect().top+window.scrollY-24;
   window.scrollTo({top:Math.max(0,top),behavior:'instant'});
  });
 }
});
demo.addEventListener('change',e=>{if(e.target.id==='use-pantry'){demoState.pantry=e.target.checked;renderDemo('#use-pantry');}});
function renderCoverage(){
 const m=demoMeals[demoState.meal],l=demoMeals[demoState.lunch],d=demoMeals[demoState.dinner];
 const cells=[['Kalorien',m.kcal+l.kcal+d.kcal,demoState.calorieTarget,'kcal'],['Protein',m.protein+l.protein+d.protein,demoState.proteinTarget,'g']];
 demo.querySelector('#goal-coverage').innerHTML=cells.map(([label,value,target,unit])=>{
  if(target===null)return `<div class="coverage-item"><strong>${label}</strong><span>Gib ein gültiges Ziel größer als 0 ein.</span></div>`;
  const percent=Math.round(value/target*100),remaining=target-value;
  return `<div class="coverage-item"><div><strong>${label}</strong><b>${percent}%</b></div><span>${value} / ${target} ${unit} pro Person</span><div class="coverage-track" aria-hidden="true"><div style="width:${Math.min(percent,100)}%"></div></div><small>${remaining>=0?`${remaining} ${unit} übrig für heute`:`${-remaining} ${unit} über dem Tagesziel`}</small></div>`;
 }).join('');
}
demo.addEventListener('input',e=>{
 const key=e.target.id==='calorie-target'?'calorieTarget':e.target.id==='protein-target'?'proteinTarget':null;if(!key)return;
 const valid=e.target.value!==''&&e.target.validity.valid&&Number(e.target.value)>0;
 demoState[key]=valid?Number(e.target.value):null;e.target.setAttribute('aria-invalid',String(!valid));renderCoverage();
});
renderDemo();
