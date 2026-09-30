// Illustrative breakfast, lunch and dinner flow. No account data or real shopping actions.
const demoMeals=sbBuildMeals('en');
const demoState={step:0,people:1,days:1,budget:null,meal:'eggs',lunch:'steak',dinner:'salmon',pantry:false,calorieTarget:1500,proteinTarget:100};
function demoBasket(state){
 const combined=new Map();
 for(const meal of [demoMeals[state.meal],demoMeals[state.lunch],demoMeals[state.dinner]])for(const [name,amount,size,price,unit='g'] of meal.items){const row=combined.get(name)||{name,needed:0,size,price,unit};row.needed+=amount*state.people*state.days;combined.set(name,row);}
 return [...combined.values()].map((r,index)=>{const needed=Math.round(r.needed*100)/100,used=state.pantry&&index===0?needed:0,packs=Math.ceil((needed-used)/r.size);return {...r,needed,used,packs,cost:packs*r.price,left:Math.round((packs*r.size-(needed-used))*100)/100};});
}
const demo=document.createElement('section');demo.id='planning-demo';demo.className='planning-demo section';
demo.innerHTML=`<div class="eyebrow">TRY THE FLOW</div><h2>Three meals.<br>One thoughtful basket.</h2><p>Make a choice. Watch your ingredients, basket and pantry update.</p><div class="demo-shell"><nav class="demo-tabs" aria-label="Planning demo steps"><button data-step="0">01 <span>Plan your meals</span></button><button data-step="1">02 <span>Build the basket</span></button><button data-step="2">03 <span>Use your pantry</span></button></nav><div class="demo-goals"><div><div class="eyebrow">YOUR DAILY GOALS · PER PERSON</div><h3>Start with your targets.</h3><p>See how breakfast, lunch and dinner contribute. This demo covers breakfast, lunch and dinner; snacks are part of the app. Portions stay fixed here.</p></div><fieldset class="goal-people"><legend>Who's eating?</legend><div class="demo-choice"><button data-people="1" aria-pressed="true">Just me</button><button data-people="2" aria-pressed="false">Two of us</button></div></fieldset><div class="goal-inputs"><label for="calorie-target">Calorie target <span>kcal / day</span><select id="calorie-target" aria-describedby="goal-help">${SB_CAL_STEPS.map(v=>'<option value="'+v+'"'+(v===1500?' selected':'')+'>'+v+' kcal</option>').join('')}</select></label><label for="protein-target">Protein target <span>g / day</span><input id="protein-target" type="number" min="1" max="1000" step="1" value="100" inputmode="numeric" aria-describedby="goal-help"></label></div><p id="goal-help">Enter your own daily targets. The same targets apply to each person in this example.</p><button type="button" class="demo-suggest" id="suggest-plan">Suggest a fitting plan</button><p class="suggest-note" id="suggest-note"></p><div id="goal-coverage" aria-live="polite"></div><div id="live-basket-cost" class="live-basket-cost" aria-live="polite"></div></div><div id="demo-panel"></div><div class="demo-bottom"><button class="demo-back">Back</button><p id="demo-progress" aria-live="polite"></p><button class="button demo-next">See the basket →</button></div></div><p class="demo-disclaimer">Interactive example, not a live order. Equal portions are used here to keep the demonstration simple. Nutrition and package prices are illustrative estimates. Nothing is saved to your account.</p>`;
document.querySelector('.app-section').before(demo);
const euro=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);
// Shown only once a spoken request named a budget.
const budgetLine=(total,s)=>s.budget===null?'':`<p class="budget-line ${total<=s.budget?'within':'over'}">Budget ${euro(s.budget)} · ${total<=s.budget?euro(s.budget-total)+' left':euro(total-s.budget)+' over'}</p>`;
function renderDemo(focus){
 const s=demoState,m=demoMeals[s.meal],l=demoMeals[s.lunch],d=demoMeals[s.dinner],rows=demoBasket(s),total=rows.reduce((a,r)=>a+r.cost,0),before=demoBasket({...s,pantry:false}).reduce((a,r)=>a+r.cost,0);
 const cooked=[m,l,d].filter(x=>x.items.length).length,eatenOut=3-cooked;
 demo.querySelectorAll('[data-people]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.people)===s.people)));
 demo.querySelectorAll('[data-step]').forEach(b=>{b.setAttribute('aria-current',Number(b.dataset.step)===s.step?'step':'false');});
 const ICONS={heat:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h22a11 11 0 0 1-22 0Z"/><path d="M3 28h26"/><path d="M12 10c0-2 2-2.4 2-4.5M18 10c0-2 2-2.4 2-4.5"/></svg>',out:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4v7a3 3 0 0 0 6 0V4"/><path d="M13 11v17"/><path d="M23 4c-2.2 2.6-2.8 6.6-1.4 9.6.4.9 1.4.4 1.4-.4V4Z"/><path d="M23 13.5V28"/></svg>'};
 const visual=meal=>meal.image?`<img src="assets/${meal.image}" alt="${meal.name}" width="640" height="640" loading="lazy" decoding="async">`:`<div class="dish-icon" role="img" aria-label="${meal.name}">${ICONS[meal.icon]}</div>`;
 const dish=(meal,slot)=>`<div class="demo-dish">${visual(meal)}<span>${slot} · ${s.people===1?'1 PERSON':s.people+' PEOPLE'}</span><h3>${meal.name}</h3><p>${meal.est?'≈ ':''}${meal.kcal} kcal · ${meal.protein} g protein <small>per person</small></p></div>`;
 const picture=`<div class="demo-dish-pair">${dish(m,'BREAKFAST')}${dish(l,'LUNCH')}${dish(d,'DINNER')}</div>`;
 let content='';
 const choices=(slot,label,options)=>`<div class="demo-controls"><fieldset><legend>Choose your ${label}</legend><div class="demo-meals">${options.map(([id,title,subtitle])=>`<button data-${slot}="${id}" aria-pressed="${s[slot]===id}">${title}<span>${subtitle}</span></button>`).join('')}</div></fieldset></div>`;
 if(s.step===0)content=`<div class="demo-selection"><div class="meal-pick-row">${dish(m,'BREAKFAST')}${choices('meal','breakfast',sbOptions('meal','en'))}</div><div class="meal-pick-row">${dish(l,'LUNCH')}${choices('lunch','lunch',sbOptions('lunch','en'))}</div><div class="meal-pick-row">${dish(d,'DINNER')}${choices('dinner','dinner',sbOptions('dinner','en'))}</div><div class="demo-result" aria-live="polite"><strong>${s.people*cooked*s.days} portions planned · ${cooked} of 3 meals from the basket</strong><span>${s.days===1?'One day':s.days+' days'} · ${m.kcal+l.kcal+d.kcal} kcal · ${m.protein+l.protein+d.protein} g protein per person per day${eatenOut?' · dinner out, counted in your targets but not in the basket':''}</span></div></div>`;
 else {
 const packText=r=>r.size===1?`${r.packs} ${r.packs===1?'pack':'packs'}`:`${r.packs} × ${r.size} ${r.unit} pack${r.packs===1?'':'s'}`;
 const amountText=r=>r.size===1?`${r.needed} ${r.needed===1?'serving':'servings'}`:`${r.needed} ${r.unit}`;
 const list=rows.map(r=>`<li class="${r.used?'from-pantry':''}"><div><strong>${r.name}</strong><small>${amountText(r)} across your meals${r.used?' · from your pantry':` · ${packText(r)}`}</small></div><b>${r.used?'Already have it':euro(r.cost)}</b></li>`).join('');
 content=`<div class="demo-cart"><div class="eyebrow">${s.step===1?'FROM RECIPE TO GROCERIES':'CHECK WHAT IS ALREADY THERE'}</div><h3>${s.step===1?'Your ingredients become a basket.':'A little less to buy.'}</h3><p>${s.step===1?'Ingredients shared by breakfast, lunch and dinner are combined before calculating whole packages.':'Try using the bread or oats you have left at home.'}</p>${s.step===2?`<label class="pantry-switch"><input type="checkbox" id="use-pantry" ${s.pantry?'checked':''}><span>I already have ${rows[0].needed} ${rows[0].unit} of ${rows[0].name.toLowerCase()}</span></label>`:''}<ul class="demo-list">${list}</ul></div><div class="demo-side">${picture}<div class="demo-result" aria-live="polite"><span>Estimated basket cost · ${s.people===1?'1 person':'2 people'}${s.days>1?' · '+s.days+' days':''}</span><strong class="demo-total">${euro(total)}</strong><span>${rows.reduce((a,r)=>a+r.packs,0)} packages to buy</span>${s.step===2?`<div class="demo-saving">${s.pantry?`${euro(before-total)} less to buy in this example`:'Tick the pantry option to see the difference.'}</div>`:''}</div>${s.step===2?`<p class="demo-explain">After a completed shop, unused package quantities can be kept for later plans. Here, the new ${rows[1].name.toLowerCase()} package leaves ${rows[1].left} ${rows[1].unit} beyond these meals.</p>`:''}</div>`;
 }
 demo.querySelector('#demo-panel').innerHTML=content;
 demo.querySelector('#demo-progress').textContent=`Step ${s.step+1} of 3`;
 demo.querySelector('.demo-back').disabled=s.step===0;
 demo.querySelector('.demo-next').textContent=['See the basket →','Check the pantry →','Try other meals ↺'][s.step];
 demo.querySelector('#live-basket-cost').innerHTML=`<div><span>Estimated shop · ${s.people===1?'1 person':'2 people'}${s.days>1?' · '+s.days+' days':''}</span><strong>${euro(total)}</strong></div><div><span>Per person</span><strong>${euro(total/s.people)}</strong></div>${budgetLine(total,s)}<p>${rows.reduce((n,r)=>n+r.packs,0)} whole packages. Shared packs may cover both people, so the shop total does not necessarily double.</p>`;
 renderCoverage();
 if(focus)demo.querySelector(focus)?.focus({preventScroll:true});
}
demo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let focus;const previousStep=demoState.step;
 if(b.id==='suggest-plan'){const best=sbBestPlan(demoState,demoMeals);if(best){demoState.meal=best.meal;demoState.lunch=best.lunch;demoState.dinner=best.dinner;demoState.pantry=false;demoState.step=0;}focus='#suggest-plan';}
 else if(b.dataset.step!==undefined)demoState.step=Number(b.dataset.step);
 else if(b.dataset.people){demoState.people=Number(b.dataset.people);focus=`[data-people="${b.dataset.people}"]`;}
 else if(b.dataset.dinner){demoState.dinner=b.dataset.dinner;focus=`[data-dinner="${b.dataset.dinner}"]`;}
 else if(b.dataset.lunch){demoState.lunch=b.dataset.lunch;focus=`[data-lunch="${b.dataset.lunch}"]`;}
 else if(b.dataset.meal){demoState.meal=b.dataset.meal;demoState.pantry=false;focus=`[data-meal="${b.dataset.meal}"]`;}
 else if(b.classList.contains('demo-next')){demoState.step=(demoState.step+1)%3;}
 else if(b.classList.contains('demo-back'))demoState.step=Math.max(0,demoState.step-1);
 renderDemo(focus);
 if(demoState.step!==previousStep){
  // Do not leave focus at the bottom of a differently sized step.
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
  if(best){demoState.meal=best.meal;demoState.lunch=best.lunch;demoState.dinner=best.dinner;demoState.pantry=false;}
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
 const m=demoMeals[demoState.meal],l=demoMeals[demoState.lunch],d=demoMeals[demoState.dinner];
 const cells=[['Calories',m.kcal+l.kcal+d.kcal,demoState.calorieTarget,'kcal'],['Protein',m.protein+l.protein+d.protein,demoState.proteinTarget,'g']];
 demo.querySelector('#goal-coverage').innerHTML=cells.map(([label,value,target,unit])=>{
  if(target===null)return `<div class="coverage-item"><strong>${label}</strong><span>Enter a valid positive target to see coverage.</span></div>`;
  const percent=Math.round(value/target*100),remaining=target-value;
  return `<div class="coverage-item"><div><strong>${label}</strong><b>${percent}%</b></div><span>${value} / ${target} ${unit} per person</span><div class="coverage-track" aria-hidden="true"><div style="width:${Math.min(percent,100)}%"></div></div><small>${remaining>=0?`${remaining} ${unit} remaining for the day`:`${-remaining} ${unit} above the daily target`}</small></div>`;
 }).join('');
 const note=demo.querySelector('#suggest-note');
 if(note){const kT=demoState.calorieTarget,sum=m.kcal+l.kcal+d.kcal,gap=Math.round(Math.abs(sum-kT));
  note.textContent=!kT?'Enter a calorie target to get a suggestion.':gap<=kT*0.05?'This plan fits your calorie target.':`This plan is ${gap} kcal ${sum>kT?'above':'below'} your target.`;}
}
demo.addEventListener('input',e=>{
 const key=e.target.id==='calorie-target'?'calorieTarget':e.target.id==='protein-target'?'proteinTarget':null;if(!key)return;
 const valid=e.target.value!==''&&e.target.validity.valid&&Number(e.target.value)>0;
 demoState[key]=valid?Number(e.target.value):null;e.target.setAttribute('aria-invalid',String(!valid));renderCoverage();
});
renderDemo();
