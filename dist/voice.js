// Spoken wishes for the planning demo. Recognition runs in the browser; SmartBasket stores nothing.
(function(){
const shell=document.querySelector('#planning-demo .demo-shell');
if(!shell||typeof demoState==='undefined')return;
const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;

const panel=document.createElement('div');
panel.className='voice-intake';
panel.innerHTML=`<div class="eyebrow">START BY SAYING IT</div>
<h3>Tell us what your basket needs.</h3>
<p>How many of you are eating, your daily targets, anything you would rather not have. If something does not fit this demo, it asks back before changing anything.</p>
<div class="voice-controls"><button type="button" class="voice-mic" aria-pressed="false"><span class="voice-dot" aria-hidden="true"></span><span class="voice-mic-label">Say your wishes</span></button><button type="button" class="voice-type-toggle" aria-expanded="false">or type it instead</button></div>
<form class="voice-typed" hidden><label for="voice-text">Your wishes</label><div><input id="voice-text" type="text" autocomplete="off" placeholder="Two of us, 2000 kcal, no fish"><button class="button" type="submit">Apply</button></div></form>
<p class="voice-heard" aria-live="polite"></p>
<div class="voice-agent" aria-live="polite"></div>
<p class="voice-privacy">Speech recognition is handled by your browser, which sends the recording to Google (Chrome) or Apple (Safari) to turn it into text. SmartBasket receives no audio and saves nothing. Typing works just as well.</p>`;
shell.prepend(panel);

const mic=panel.querySelector('.voice-mic'),micLabel=panel.querySelector('.voice-mic-label');
const typeToggle=panel.querySelector('.voice-type-toggle'),typedForm=panel.querySelector('.voice-typed'),typedInput=panel.querySelector('#voice-text');
const heard=panel.querySelector('.voice-heard'),agent=panel.querySelector('.voice-agent');
const dishName=id=>demoMeals[id].name;

if(!SpeechRec){
 mic.hidden=true;typeToggle.hidden=true;typedForm.hidden=false;
 panel.querySelector('.voice-privacy').textContent='This browser has no built-in speech recognition, so the demo takes your wishes as text. Nothing you type is saved or sent anywhere.';
}

function syncInputs(){
 const c=shell.querySelector('#calorie-target'),p=shell.querySelector('#protein-target');
 if(c&&demoState.calorieTarget!==null)c.value=demoState.calorieTarget;
 if(p&&demoState.proteinTarget!==null)p.value=demoState.proteinTarget;
}

// Reads the wishes we can act on, and collects a question for everything this demo cannot do.
function parseWishes(text){
 const t=' '+text.toLowerCase().replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ')+' ';
 const applied=[],questions=[];

 let people=null;
 if(/ (just me|only me|by myself|alone|for one|for 1) /.test(t))people=1;
 else if(/ (two of us|the two of us|for two|for 2|both of us|my partner) /.test(t))people=2;
 else{
  const words={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8};
  const count='\\d+|'+Object.keys(words).join('|');
  const m=t.match(new RegExp(' (?:for|we are|there are) ('+count+') '))||t.match(new RegExp(' ('+count+') (?:people|persons|of us) '));
  if(m)people=words[m[1]]||Number(m[1]);
 }
 if(people===1||people===2){demoState.people=people;applied.push(people===1?'one person':'two people');}
 else if(people!==null)questions.push({
  message:`You mentioned ${people} people. This demo plans for one or two — the app handles bigger tables.`,
  options:[{label:'Use two people',apply(){demoState.people=2;}},{label:'Just me',apply(){demoState.people=1;}}]
 });

 const kcalMatch=t.match(/ (\d{2,6}) ?(?:kcal|calories|cal) /)||t.match(/ calories? (?:target |of |at )?(\d{2,6}) /);
 if(kcalMatch){
  const kcal=Number(kcalMatch[1]);
  if(kcal>=1&&kcal<=10000){demoState.calorieTarget=kcal;applied.push(kcal+' kcal a day');}
  else questions.push({
   message:`${kcal} kcal is outside the range this demo calculates (1 to 10000).`,
   options:[{label:'Use 2000 kcal',apply(){demoState.calorieTarget=2000;}},{label:'Leave it at '+demoState.calorieTarget,apply(){}}]
  });
 }

 const proteinMatch=t.match(/ (\d{1,4}) ?(?:g|grams?)? (?:of )?protein /)||t.match(/ protein (?:target |of |at )?(\d{1,4}) /);
 if(proteinMatch){
  const protein=Number(proteinMatch[1]);
  if(protein>=1&&protein<=1000){demoState.proteinTarget=protein;applied.push(protein+' g protein a day');}
  else questions.push({
   message:`${protein} g of protein is outside the range this demo calculates (1 to 1000).`,
   options:[{label:'Use 100 g',apply(){demoState.proteinTarget=100;}},{label:'Leave it at '+demoState.proteinTarget,apply(){}}]
  });
 }

 const vegan=/ (vegan|plant-based|plant based) /.test(t),vegetarian=vegan||/ (vegetarian|veggie|no meat|meat-free) /.test(t);
 if(vegetarian){
  if(vegan){demoState.meal='oats';applied.push('plant-based breakfast');}
  demoState.dinner='teriyaki';applied.push('tofu for dinner');
  questions.push({
   message:'Both lunches in this demo contain meat, so I cannot make the whole day meat-free here. Breakfast and dinner are set.',
   options:[{label:'Fine, I will pick lunch',apply(){}},{label:'Show me the meat lunch anyway',apply(){demoState.step=0;}}]
  });
 }else if(/ (no fish|without fish|not? salmon) /.test(t)){demoState.dinner='teriyaki';applied.push('no fish');}
 else if(/ (fish|salmon) /.test(t)){demoState.dinner='salmon';applied.push(dishName('salmon').toLowerCase());}

 if(/ (leftovers?|pantry|already have|still have|use up) /.test(t)){demoState.pantry=true;applied.push('pantry taken into account');}

 const days=t.match(/ (\d+) days? /);
 if((days&&Number(days[1])>1)||/ (a |the )?week /.test(t)||/ (several|multiple) days /.test(t))questions.push({
  message:'This demo plans a single day with breakfast, lunch and dinner. Planning several days at once is part of the app.',
  options:[{label:'Continue with one day',apply(){}}]
 });
 if(/ snacks? /.test(t))questions.push({
  message:'Snacks are part of the app, not of this demo — it covers breakfast, lunch and dinner.',
  options:[{label:'Understood',apply(){}}]
 });

 return {applied,questions};
}

let pending=[];

function handleWishes(text){
 const clean=text.trim();
 if(!clean)return;
 heard.textContent='“'+clean+'”';
 const {applied,questions}=parseWishes(clean);
 if(!applied.length&&!questions.length){
  agent.innerHTML='<p class="voice-question">I could not pick anything out of that. Try something like <em>“Two of us, 2000 kcal, no fish”</em>.</p>';
  return;
 }
 demoState.step=0;
 syncInputs();renderDemo();
 agent.innerHTML=applied.length?`<p class="voice-applied">Set: ${applied.join(' · ')}</p>`:'';
 pending=questions;
 renderQuestion(Boolean(applied.length));
}

function renderQuestion(keepApplied){
 const summary=keepApplied?agent.querySelector('.voice-applied')?.outerHTML||'':'';
 if(!pending.length){
  agent.innerHTML=summary+'<p class="voice-question">That is everything I can set from here.</p><button type="button" class="button voice-continue">Continue with the meals →</button>';
  return;
 }
 const q=pending[0];
 agent.innerHTML=summary+`<p class="voice-question">${q.message}</p><div class="voice-options">${q.options.map((o,i)=>`<button type="button" data-voice-option="${i}">${o.label}</button>`).join('')}</div>`;
}

// The demo delegates clicks on its whole section, so keep our own buttons from triggering a second render.
panel.addEventListener('click',e=>{if(e.target.closest('button'))e.stopPropagation();});

agent.addEventListener('click',e=>{
 const option=e.target.closest('[data-voice-option]');
 if(option){
  pending.shift().options[Number(option.dataset.voiceOption)].apply();
  syncInputs();renderDemo();renderQuestion(true);
  return;
 }
 if(e.target.closest('.voice-continue')){
  renderDemo();
  const first=shell.querySelector('[data-meal]');
  if(first){first.focus({preventScroll:true});first.scrollIntoView({block:'center',behavior:'smooth'});}
 }
});

typeToggle.addEventListener('click',()=>{
 const open=typedForm.hidden;
 typedForm.hidden=!open;
 typeToggle.setAttribute('aria-expanded',String(open));
 if(open)typedInput.focus();
});
typedForm.addEventListener('submit',e=>{e.preventDefault();handleWishes(typedInput.value);typedInput.value='';});

let recognition=null,listening=false;
function stopListening(){
 listening=false;
 mic.setAttribute('aria-pressed','false');
 micLabel.textContent='Say your wishes';
}
mic.addEventListener('click',()=>{
 if(listening){recognition.stop();return;}
 recognition=new SpeechRec();
 recognition.lang='en-US';
 recognition.interimResults=true;
 recognition.maxAlternatives=1;
 recognition.onstart=()=>{listening=true;mic.setAttribute('aria-pressed','true');micLabel.textContent='Listening · stop';heard.textContent='';agent.innerHTML='';};
 recognition.onresult=e=>{
  let text='';
  for(const result of e.results)text+=result[0].transcript;
  heard.textContent='“'+text.trim()+'”';
  if(e.results[e.results.length-1].isFinal)handleWishes(text);
 };
 recognition.onerror=e=>{
  stopListening();
  if(e.error==='aborted')return;
  const message=e.error==='not-allowed'||e.error==='service-not-allowed'
   ?'Your browser did not allow microphone access. You can type your wishes instead.'
   :e.error==='no-speech'?'I did not hear anything. Try again, or type it instead.'
   :'Speech recognition is not available right now. Typing works too.';
  agent.innerHTML=`<p class="voice-question">${message}</p>`;
  typedForm.hidden=false;typeToggle.setAttribute('aria-expanded','true');
 };
 recognition.onend=stopListening;
 recognition.start();
});
})();
