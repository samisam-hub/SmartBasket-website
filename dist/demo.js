// Illustrative breakfast, lunch and dinner flow. No account data or real shopping actions.
const demoMeals={
 eggs:{name:'Sunny-side-up sourdough',image:'breakfast.webp',kcal:389,protein:21,items:[['Sourdough bread',70,500,2.8],['Eggs (edible mass)',100,300,2.4],['Cherry tomatoes',100,250,1.8],['Spinach',30,200,1.5],['Olive oil',5,450,5.5],['Parsley',3,30,.9],['Black pepper',.2,50,1.2]]},
 steak:{name:'Steak with potatoes and spinach',image:'steak.webp',kcal:569,protein:43,items:[['Beef steak (raw)',160,300,6],['Potatoes',220,1000,2],['Spinach',100,200,1.5],['Olive oil',8,450,5.5],['Parsley',3,30,.9],['Black pepper',.2,50,1.2]]},
 stroganoff:{name:'Chicken Stroganoff with noodles',image:'stroganoff.webp',kcal:632,protein:54,items:[['Chicken breast (raw)',180,600,5.4],['Noodles (dry)',65,500,1.4],['Button mushrooms',100,250,1.8],['Onion',40,500,1],['Soy cooking cream',70,200,1.5,'ml'],['Olive oil',5,450,5.5],['Parsley',3,30,.9],['Black pepper',.2,50,1.2]]},
 salmon:{name:'Salmon with potatoes and spinach',image:'salmon.webp',kcal:608,protein:40,items:[['Salmon fillet (raw)',150,300,5.9],['Potatoes',280,1000,2],['Spinach',150,200,1.5],['Olive oil',5,450,5.5],['Parsley',3,30,.9],['Black pepper',.2,50,1.2]]},
 teriyaki:{name:'Tofu teriyaki noodles',image:'teriyaki.webp',kcal:686,protein:47,items:[['Plain tofu',200,400,2.5],['Noodles (dry)',70,500,1.4],['Broccoli',150,500,1.9],['Carrots',100,1000,1.5],['Olive oil',5,450,5.5],['Teriyaki marinade',15,250,2.5,'ml'],['Parsley',3,30,.9],['Black pepper',.2,50,1.2]]},
 oats:{name:'Overnight oats with banana',image:'oats.webp',kcal:453,protein:13,items:[['Rolled oats',80,500,1.4],['Banana',120,600,1.5],['Berries',100,250,2.2]]}
};
const demoState={step:0,people:1,meal:'eggs',lunch:'steak',dinner:'salmon',pantry:false,calorieTarget:1500,proteinTarget:100};
function demoBasket(state){
 const combined=new Map();
 for(const meal of [demoMeals[state.meal],demoMeals[state.lunch],demoMeals[state.dinner]])for(const [name,amount,size,price,unit='g'] of meal.items){const row=combined.get(name)||{name,needed:0,size,price,unit};row.needed+=amount*state.people;combined.set(name,row);}
 return [...combined.values()].map((r,index)=>{const needed=Math.round(r.needed*100)/100,used=state.pantry&&index===0?needed:0,packs=Math.ceil((needed-used)/r.size);return {...r,needed,used,packs,cost:packs*r.price,left:Math.round((packs*r.size-(needed-used))*100)/100};});
}
const demo=document.createElement('section');demo.id='planning-demo';demo.className='planning-demo section';
demo.innerHTML=`<div class="eyebrow">TRY THE FLOW</div><h2>Three meals.<br>One thoughtful basket.</h2><p>Make a choice. Watch your ingredients, basket and pantry update.</p><div class="demo-shell"><nav class="demo-tabs" aria-label="Planning demo steps"><button data-step="0">01 <span>Plan your meals</span></button><button data-step="1">02 <span>Build the basket</span></button><button data-step="2">03 <span>Use your pantry</span></button></nav><div class="demo-goals"><div><div class="eyebrow">YOUR DAILY GOALS · PER PERSON</div><h3>Start with your targets.</h3><p>See how breakfast, lunch and dinner contribute. This demo covers breakfast, lunch and dinner; snacks are part of the app. Portions stay fixed here.</p></div><fieldset class="goal-people"><legend>Who's eating?</legend><div class="demo-choice"><button data-people="1" aria-pressed="true">Just me</button><button data-people="2" aria-pressed="false">Two of us</button></div></fieldset><div class="goal-inputs"><label for="calorie-target">Calorie target <span>kcal / day</span><input id="calorie-target" type="number" min="1" max="10000" step="1" value="1500" inputmode="numeric" aria-describedby="goal-help"></label><label for="protein-target">Protein target <span>g / day</span><input id="protein-target" type="number" min="1" max="1000" step="1" value="100" inputmode="numeric" aria-describedby="goal-help"></label></div><p id="goal-help">Enter your own daily targets. The same targets apply to each person in this example.</p><div id="goal-coverage" aria-live="polite"></div><div id="live-basket-cost" class="live-basket-cost" aria-live="polite"></div></div><div id="demo-panel"></div><div class="demo-bottom"><button class="demo-back">Back</button><p id="demo-progress" aria-live="polite"></p><button class="button demo-next">See the basket →</button></div></div><p class="demo-disclaimer">Interactive example, not a live order. Equal portions are used here to keep the demonstration simple. Nutrition and package prices are illustrative estimates. Nothing is saved to your account.</p>`;
document.querySelector('.app-section').before(demo);
const euro=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);
function renderDemo(focus){
 const s=demoState,m=demoMeals[s.meal],l=demoMeals[s.lunch],d=demoMeals[s.dinner],rows=demoBasket(s),total=rows.reduce((a,r)=>a+r.cost,0),before=demoBasket({...s,pantry:false}).reduce((a,r)=>a+r.cost,0);
 demo.querySelectorAll('[data-people]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.people)===s.people)));
 demo.querySelectorAll('[data-step]').forEach(b=>{b.setAttribute('aria-current',Number(b.dataset.step)===s.step?'step':'false');});
 const dish=(meal,slot)=>`<div class="demo-dish"><img src="assets/${meal.image}" alt="${meal.name}" width="640" height="640" loading="lazy" decoding="async"><span>${slot} · ${s.people===1?'1 PERSON':s.people+' PEOPLE'}</span><h3>${meal.name}</h3><p>${meal.kcal} kcal · ${meal.protein} g protein <small>per person</small></p></div>`;
 const picture=`<div class="demo-dish-pair">${dish(m,'BREAKFAST')}${dish(l,'LUNCH')}${dish(d,'DINNER')}</div>`;
 let content='';
 const choices=(slot,label,options)=>`<div class="demo-controls"><fieldset><legend>Choose your ${label}</legend><div class="demo-meals">${options.map(([id,title,subtitle])=>`<button data-${slot}="${id}" aria-pressed="${s[slot]===id}">${title}<span>${subtitle}</span></button>`).join('')}</div></fieldset></div>`;
 if(s.step===0)content=`<div class="demo-selection"><div class="meal-pick-row">${dish(m,'BREAKFAST')}${choices('meal','breakfast',[['eggs','Eggs on sourdough','Savoury & satisfying'],['oats','Banana overnight oats','Simple & plant-based']])}</div><div class="meal-pick-row">${dish(l,'LUNCH')}${choices('lunch','lunch',[['steak','Steak with potatoes','Spinach & fresh herbs'],['stroganoff','Chicken Stroganoff','Noodles & creamy mushroom sauce']])}</div><div class="meal-pick-row">${dish(d,'DINNER')}${choices('dinner','dinner',[['salmon','Salmon with potatoes','Spinach & fresh herbs'],['teriyaki','Tofu teriyaki noodles','Broccoli, carrots & teriyaki sauce']])}</div><div class="demo-result" aria-live="polite"><strong>3 meals · ${s.people*3} portions planned</strong><span>${m.kcal+l.kcal+d.kcal} kcal · ${m.protein+l.protein+d.protein} g protein per person across all three meals</span></div></div>`;
 else {
 const list=rows.map(r=>`<li class="${r.used?'from-pantry':''}"><div><strong>${r.name}</strong><small>${r.needed} ${r.unit} across your meals${r.used?' · from your pantry':` · ${r.packs} × ${r.size} ${r.unit} pack${r.packs===1?'':'s'}`}</small></div><b>${r.used?'Already have it':euro(r.cost)}</b></li>`).join('');
 content=`<div class="demo-cart"><div class="eyebrow">${s.step===1?'FROM RECIPE TO GROCERIES':'CHECK WHAT IS ALREADY THERE'}</div><h3>${s.step===1?'Your ingredients become a basket.':'A little less to buy.'}</h3><p>${s.step===1?'Ingredients shared by breakfast, lunch and dinner are combined before calculating whole packages.':'Try using the bread or oats you have left at home.'}</p>${s.step===2?`<label class="pantry-switch"><input type="checkbox" id="use-pantry" ${s.pantry?'checked':''}><span>I already have ${rows[0].needed} ${rows[0].unit} of ${rows[0].name.toLowerCase()}</span></label>`:''}<ul class="demo-list">${list}</ul></div><div class="demo-side">${picture}<div class="demo-result" aria-live="polite"><span>Estimated basket cost · ${s.people===1?'1 person':'2 people'}</span><strong class="demo-total">${euro(total)}</strong><span>${rows.reduce((a,r)=>a+r.packs,0)} packages to buy</span>${s.step===2?`<div class="demo-saving">${s.pantry?`${euro(before-total)} less to buy in this example`:'Tick the pantry option to see the difference.'}</div>`:''}</div>${s.step===2?`<p class="demo-explain">After a completed shop, unused package quantities can be kept for later plans. Here, the new ${rows[1].name.toLowerCase()} package leaves ${rows[1].left} ${rows[1].unit} beyond these meals.</p>`:''}</div>`;
 }
 demo.querySelector('#demo-panel').innerHTML=content;
 demo.querySelector('#demo-progress').textContent=`Step ${s.step+1} of 3`;
 demo.querySelector('.demo-back').disabled=s.step===0;
 demo.querySelector('.demo-next').textContent=['See the basket →','Check the pantry →','Try other meals ↺'][s.step];
 demo.querySelector('#live-basket-cost').innerHTML=`<div><span>Estimated shop · ${s.people===1?'1 person':'2 people'}</span><strong>${euro(total)}</strong></div><div><span>Per person</span><strong>${euro(total/s.people)}</strong></div><p>${rows.reduce((n,r)=>n+r.packs,0)} whole packages. Shared packs may cover both people, so the shop total does not necessarily double.</p>`;
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
  // Do not leave focus at the bottom of a differently sized step.
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
 const cells=[['Calories',m.kcal+l.kcal+d.kcal,demoState.calorieTarget,'kcal'],['Protein',m.protein+l.protein+d.protein,demoState.proteinTarget,'g']];
 demo.querySelector('#goal-coverage').innerHTML=cells.map(([label,value,target,unit])=>{
  if(target===null)return `<div class="coverage-item"><strong>${label}</strong><span>Enter a valid positive target to see coverage.</span></div>`;
  const percent=Math.round(value/target*100),remaining=target-value;
  return `<div class="coverage-item"><div><strong>${label}</strong><b>${percent}%</b></div><span>${value} / ${target} ${unit} per person</span><div class="coverage-track" aria-hidden="true"><div style="width:${Math.min(percent,100)}%"></div></div><small>${remaining>=0?`${remaining} ${unit} remaining for the day`:`${-remaining} ${unit} above the daily target`}</small></div>`;
 }).join('');
}
demo.addEventListener('input',e=>{
 const key=e.target.id==='calorie-target'?'calorieTarget':e.target.id==='protein-target'?'proteinTarget':null;if(!key)return;
 const valid=e.target.value!==''&&e.target.validity.valid&&Number(e.target.value)>0;
 demoState[key]=valid?Number(e.target.value):null;e.target.setAttribute('aria-invalid',String(!valid));renderCoverage();
});
renderDemo();
