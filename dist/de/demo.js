// Beispielhafter Ablauf für Frühstück, Mittag- und Abendessen. Keine Kontodaten, keine echten Einkäufe.
const demoMeals=sbBuildMeals('de');
const demoState={step:0,people:1,days:1,budget:null,meal:'eggs',lunch:'steak',dinner:'salmon',snack:'nosnack',pantry:false,calorieTarget:1500,proteinTarget:100};
function demoBasket(state){
 const combined=new Map();
 for(const meal of [demoMeals[state.meal],demoMeals[state.lunch],demoMeals[state.dinner],demoMeals[state.snack]])for(const [name,amount,size,price,unit='g'] of meal.items){const row=combined.get(name)||{name,needed:0,size,price,unit};row.needed+=amount*state.people*state.days;combined.set(name,row);}
 return [...combined.values()].map((r,index)=>{const needed=Math.round(r.needed*100)/100,used=state.pantry&&index===0?needed:0,packs=Math.ceil((needed-used)/r.size);return {...r,needed,used,packs,cost:packs*r.price,left:Math.round((packs*r.size-(needed-used))*100)/100};});
}
const demo=document.createElement('section');demo.id='planning-demo';demo.className='planning-demo section';
demo.innerHTML=`<div class="eyebrow">AUSPROBIEREN</div><h2>Drei Mahlzeiten und ein Snack.<br>Ein durchdachter Einkauf.</h2><p>Triff eine Wahl. Zutaten, Einkauf und Vorrat aktualisieren sich sofort.</p><div class="demo-shell"><nav class="demo-tabs" aria-label="Schritte der Planungsdemo"><button data-step="0">01 <span>Mahlzeiten planen</span></button><button data-step="1">02 <span>Einkauf zusammenstellen</span></button><button data-step="2">03 <span>Vorrat nutzen</span></button></nav><div class="demo-goals"><div><div class="eyebrow">DEINE TAGESZIELE · PRO PERSON</div><h3>Beginne mit deinen Zielen.</h3><p>Sieh, wie Frühstück, Mittag- und Abendessen dazu beitragen. Diese Demo deckt Frühstück, Mittag- und Abendessen sowie einen Snack ab. Die Portionen bleiben fest, der Snack sorgt also für die feinen Schritte. Sie wählt aus wenigen Gerichten, während die App deine Ziele mit dem ganzen Katalog abgleicht.</p></div><fieldset class="goal-people"><legend>Wer isst mit?</legend><div class="demo-choice"><button data-people="1" aria-pressed="true">Nur ich</button><button data-people="2" aria-pressed="false">Zu zweit</button></div></fieldset><div class="goal-inputs"><label for="calorie-target">Kalorienziel <span>kcal / Tag</span><select id="calorie-target" aria-describedby="goal-help">${SB_CAL_STEPS.map(v=>'<option value="'+v+'"'+(v===1500?' selected':'')+'>'+v+' kcal</option>').join('')}</select></label><label for="protein-target">Proteinziel <span>g / Tag</span><input id="protein-target" type="number" min="1" max="1000" step="1" value="100" inputmode="numeric" aria-describedby="goal-help"></label></div><p id="goal-help">Wähle ein Kalorienziel und trage dein Proteinziel ein. In diesem Beispiel gelten dieselben Ziele für jede Person.</p><p class="suggest-note" id="suggest-note"></p><div id="goal-coverage" aria-live="polite"></div><div id="live-basket-cost" class="live-basket-cost" aria-live="polite"></div></div><div id="demo-panel"></div><div class="demo-bottom"><button class="demo-back">Zurück</button><p id="demo-progress" aria-live="polite"></p><button class="button demo-next">Zum Einkauf →</button></div></div><p class="demo-disclaimer">Interaktives Beispiel, keine echte Bestellung. Zur Vereinfachung werden hier gleiche Portionen verwendet. Nährwerte und Packungspreise sind beispielhafte Schätzungen. Es wird nichts in deinem Konto gespeichert.</p>`;
document.querySelector('.app-section').before(demo);
const euro=n=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n);
// Erscheint erst, wenn ein gesprochener Wunsch ein Budget genannt hat.
const budgetLine=(total,s)=>s.budget===null?'':`<p class="budget-line ${total<=s.budget?'within':'over'}">Budget ${euro(s.budget)} · ${total<=s.budget?euro(s.budget-total)+' übrig':euro(total-s.budget)+' darüber'}</p>`;
function renderDemo(focus){
 const s=demoState,m=demoMeals[s.meal],l=demoMeals[s.lunch],d=demoMeals[s.dinner],sn=demoMeals[s.snack],rows=demoBasket(s),total=rows.reduce((a,r)=>a+r.cost,0),before=demoBasket({...s,pantry:false}).reduce((a,r)=>a+r.cost,0);
 const cooked=[m,l,d].filter(x=>x.items.length).length,eatenOut=3-cooked;
 demo.querySelectorAll('[data-people]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.people)===s.people)));
 demo.querySelectorAll('[data-step]').forEach(b=>{b.setAttribute('aria-current',Number(b.dataset.step)===s.step?'step':'false');});
 const ICONS={none:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="16" cy="16" r="10"/><path d="M11 16h10"/></svg>',dish:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14h20v7a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5v-7Z"/><path d="M4 14h24"/><path d="M26 16h2.5a2 2 0 0 1 0 4H26"/><path d="M13 9c0-1.6 1.6-1.9 1.6-3.6M19 9c0-1.6 1.6-1.9 1.6-3.6"/></svg>',heat:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h22a11 11 0 0 1-22 0Z"/><path d="M3 28h26"/><path d="M12 10c0-2 2-2.4 2-4.5M18 10c0-2 2-2.4 2-4.5"/></svg>',out:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4v7a3 3 0 0 0 6 0V4"/><path d="M13 11v17"/><path d="M23 4c-2.2 2.6-2.8 6.6-1.4 9.6.4.9 1.4.4 1.4-.4V4Z"/><path d="M23 13.5V28"/></svg>'};
 const visual=meal=>meal.image?`<img src="../assets/${meal.image}" alt="${meal.name}" width="640" height="640" loading="lazy" decoding="async">`:`<div class="dish-icon" role="img" aria-label="${meal.name}">${ICONS[meal.icon]}</div>`;
 const dish=(meal,slot)=>`<div class="demo-dish">${visual(meal)}<span>${slot} · ${s.people===1?'1 PERSON':s.people+' PERSONEN'}</span><h3>${meal.name}</h3><p>${meal.est?'≈ ':''}${meal.kcal} kcal · ${meal.protein} g Protein <small>pro Person</small></p></div>`;
 const picture=`<div class="demo-dish-pair">${dish(m,'FRÜHSTÜCK')}${dish(l,'MITTAGESSEN')}${dish(d,'ABENDESSEN')}${dish(sn,'SNACK')}</div>`;
 let content='';
 const choices=(slot,legende,options)=>`<div class="demo-controls"><fieldset><legend>${legende}</legend><div class="demo-meals">${options.map(([id,title,subtitle])=>`<button data-${slot}="${id}" aria-pressed="${s[slot]===id}">${title}<span>${subtitle}</span></button>`).join('')}</div></fieldset></div>`;
 if(s.step===0)content=`<div class="demo-selection"><div class="meal-pick-row">${dish(m,'FRÜHSTÜCK')}${choices('meal','Wähle dein Frühstück',sbOptions('meal','de'))}</div><div class="meal-pick-row">${dish(l,'MITTAGESSEN')}${choices('lunch','Wähle dein Mittagessen',sbOptions('lunch','de'))}</div><div class="meal-pick-row">${dish(d,'ABENDESSEN')}${choices('dinner','Wähle dein Abendessen',sbOptions('dinner','de'))}</div><div class="meal-pick-row">${dish(sn,'SNACK')}${choices('snack','Wähle deinen Snack',sbOptions('snack','de'))}</div><div class="demo-result" aria-live="polite"><strong>${s.people*cooked*s.days} Portionen geplant · ${cooked} von 3 Mahlzeiten aus dem Einkauf</strong><span>${s.days===1?'Ein Tag':s.days+' Tage'} · ${m.kcal+l.kcal+d.kcal+sn.kcal} kcal · ${m.protein+l.protein+d.protein+sn.protein} g Protein pro Person und Tag${eatenOut?' · Abendessen auswärts, zählt bei den Zielen mit, aber nicht im Einkauf':''}</span></div></div>`;
 else {
 const packText=r=>r.size===1?`${r.packs===1?'1 Packung':r.packs+' Packungen'}`:`${r.packs} × ${r.size} ${r.unit} ${r.packs===1?'Packung':'Packungen'}`;
 const amountText=r=>r.size===1?`${r.needed} ${r.needed===1?'Portion':'Portionen'}`:`${r.needed} ${r.unit}`;
 const list=rows.map(r=>`<li class="${r.used?'from-pantry':''}"><div><strong>${r.name}</strong><small>${amountText(r)} für deine Mahlzeiten${r.used?' · aus deinem Vorrat':` · ${packText(r)}`}</small></div><b>${r.used?'Schon da':euro(r.cost)}</b></li>`).join('');
 content=`<div class="demo-cart"><div class="eyebrow">${s.step===1?'VOM REZEPT ZUM EINKAUF':'SCHAU, WAS SCHON DA IST'}</div><h3>${s.step===1?'Aus Zutaten wird ein Einkauf.':'Ein bisschen weniger kaufen.'}</h3><p>${s.step===1?'Zutaten, die in mehreren Mahlzeiten vorkommen, werden zusammengefasst, bevor ganze Packungen berechnet werden.':'Nutze das Brot oder die Haferflocken, die du noch zu Hause hast.'}</p>${s.step===2?`<label class="pantry-switch"><input type="checkbox" id="use-pantry" ${s.pantry?'checked':''}><span>Ich habe noch ${rows[0].needed} ${rows[0].unit} ${rows[0].name}</span></label>`:''}<ul class="demo-list">${list}</ul></div><div class="demo-side">${picture}<div class="demo-result" aria-live="polite"><span>Geschätzte Einkaufssumme · ${s.people===1?'1 Person':'2 Personen'}${s.days>1?' · '+s.days+' Tage':''}</span><strong class="demo-total">${euro(total)}</strong><span>${rows.reduce((a,r)=>a+r.packs,0)} Packungen zu kaufen</span>${s.step===2?`<div class="demo-saving">${s.pantry?`${euro(before-total)} weniger in diesem Beispiel`:'Setze den Haken, um den Unterschied zu sehen.'}</div>`:''}</div>${s.step===2?`<p class="demo-explain">Nach einem erledigten Einkauf lassen sich nicht verbrauchte Packungsmengen für spätere Pläne aufheben. Hier bleiben von der neuen Packung ${rows[1].name} noch ${rows[1].left} ${rows[1].unit} über diese Mahlzeiten hinaus.</p>`:''}</div>`;
 }
 demo.querySelector('#demo-panel').innerHTML=content;
 demo.querySelector('#demo-progress').textContent=`Schritt ${s.step+1} von 3`;
 demo.querySelector('.demo-back').disabled=s.step===0;
 demo.querySelector('.demo-next').textContent=['Zum Einkauf →','Vorrat prüfen →','Andere Mahlzeiten ↺'][s.step];
 demo.querySelector('#live-basket-cost').innerHTML=`<div><span>Geschätzter Einkauf · ${s.people===1?'1 Person':'2 Personen'}${s.days>1?' · '+s.days+' Tage':''}</span><strong>${euro(total)}</strong></div><div><span>Pro Person</span><strong>${euro(total/s.people)}</strong></div>${budgetLine(total,s)}<p>${rows.reduce((n,r)=>n+r.packs,0)} ganze Packungen. Geteilte Packungen können für beide reichen, deshalb verdoppelt sich die Summe nicht zwangsläufig.</p>`;
 renderCoverage();
 if(focus)demo.querySelector(focus)?.focus({preventScroll:true});
}
demo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let focus;const previousStep=demoState.step;
 if(b.dataset.step!==undefined)demoState.step=Number(b.dataset.step);
 else if(b.dataset.people){demoState.people=Number(b.dataset.people);focus=`[data-people="${b.dataset.people}"]`;}
 else if(b.dataset.snack){demoState.snack=b.dataset.snack;focus='[data-snack="'+b.dataset.snack+'"]';}
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
demo.addEventListener('change',e=>{
 if(e.target.id==='use-pantry'){demoState.pantry=e.target.checked;renderDemo('#use-pantry');}
 else if(e.target.id==='calorie-target'){
  demoState.calorieTarget=Number(e.target.value);
  const best=sbBestPlan(demoState,demoMeals);
  if(best){demoState.meal=best.meal;demoState.lunch=best.lunch;demoState.dinner=best.dinner;demoState.snack=best.snack;demoState.pantry=false;}
  renderDemo('#calorie-target');
 }
});
// Haelt die Auswahlliste und demoState.calorieTarget zusammen. Ein Wert, der nicht in der
// Liste steht (etwa aus der Spracheingabe), wird an der passenden Stelle eingehaengt.
function sbSyncCalorieSelect(){
 const sel=demo.querySelector('#calorie-target');if(!sel||!sel.options)return;
 const v=demoState.calorieTarget;if(v===null||v===undefined)return;
 const vorhanden=Array.prototype.some.call(sel.options,o=>Number(o.value)===v);
 if(!vorhanden){
  const o=document.createElement('option');o.value=String(v);o.textContent=v+' kcal';
  const dahinter=Array.prototype.find.call(sel.options,x=>Number(x.value)>v);
  sel.insertBefore(o,dahinter||null);
 }
 if(sel.value!==String(v))sel.value=String(v);
}
function renderCoverage(){
 sbSyncCalorieSelect();
 const m=demoMeals[demoState.meal],l=demoMeals[demoState.lunch],d=demoMeals[demoState.dinner],sn=demoMeals[demoState.snack];
 const cells=[['Kalorien',m.kcal+l.kcal+d.kcal+sn.kcal,demoState.calorieTarget,'kcal'],['Protein',m.protein+l.protein+d.protein+sn.protein,demoState.proteinTarget,'g']];
 demo.querySelector('#goal-coverage').innerHTML=cells.map(([label,value,target,unit])=>{
  if(target===null)return `<div class="coverage-item"><strong>${label}</strong><span>Gib ein gültiges Ziel größer als 0 ein.</span></div>`;
  const percent=Math.round(value/target*100),remaining=target-value;
  return `<div class="coverage-item"><div><strong>${label}</strong><b>${percent}%</b></div><span>${value} / ${target} ${unit} pro Person</span><div class="coverage-track" aria-hidden="true"><div style="width:${Math.min(percent,100)}%"></div></div><small>${remaining>=0?`${remaining} ${unit} übrig für heute`:`${-remaining} ${unit} über dem Tagesziel`}</small></div>`;
 }).join('');
 const note=demo.querySelector('#suggest-note');
 if(note){const kT=demoState.calorieTarget,sum=m.kcal+l.kcal+d.kcal+sn.kcal,gap=Math.round(Math.abs(sum-kT));
  note.textContent=!kT?'Trage ein Kalorienziel ein, um einen Vorschlag zu bekommen.':gap<=kT*0.05?'Dieser Plan trifft dein Kalorienziel.':`Dieser Plan liegt ${gap} kcal ${sum>kT?'über':'unter'} deinem Ziel.`;}
}
demo.addEventListener('input',e=>{
 const key=e.target.id==='calorie-target'?'calorieTarget':e.target.id==='protein-target'?'proteinTarget':null;if(!key)return;
 const valid=e.target.value!==''&&e.target.validity.valid&&Number(e.target.value)>0;
 demoState[key]=valid?Number(e.target.value):null;e.target.setAttribute('aria-invalid',String(!valid));renderCoverage();
});
renderDemo();
