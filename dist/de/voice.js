// Gesprochene Wünsche für die Planungs-Demo. Die Erkennung läuft im Browser; SmartBasket speichert nichts.
(function(){
const shell=document.querySelector('#planning-demo .demo-shell');
if(!shell||typeof demoState==='undefined')return;
const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;

const panel=document.createElement('div');
panel.className='voice-intake';
panel.innerHTML=`<div class="eyebrow">SAG ES EINFACH</div>
<h3>Sag, was in deinen Einkauf soll.</h3>
<p>Wie viele ihr seid, deine Tagesziele, was nicht auf den Tisch soll. Was diese Demo nicht kann, fragt sie nach, bevor sie etwas ändert.</p>
<div class="voice-controls"><button type="button" class="voice-mic" aria-pressed="false"><span class="voice-dot" aria-hidden="true"></span><span class="voice-mic-label">Wünsche sagen</span></button><button type="button" class="voice-type-toggle" aria-expanded="false">oder lieber tippen</button></div>
<form class="voice-typed" hidden><label for="voice-text">Deine Wünsche</label><div><input id="voice-text" type="text" autocomplete="off" placeholder="Wir sind zu zweit, 2000 kcal, kein Fisch"><button class="button" type="submit">Übernehmen</button></div></form>
<p class="voice-heard" aria-live="polite"></p>
<div class="voice-agent" aria-live="polite"></div>
<p class="voice-privacy">Die Spracherkennung übernimmt dein Browser: Chrome sendet die Aufnahme dafür an Google, Safari an Apple. SmartBasket bekommt keine Audiodaten und speichert nichts. Tippen funktioniert genauso gut.</p>`;
shell.prepend(panel);

const mic=panel.querySelector('.voice-mic'),micLabel=panel.querySelector('.voice-mic-label');
const typeToggle=panel.querySelector('.voice-type-toggle'),typedForm=panel.querySelector('.voice-typed'),typedInput=panel.querySelector('#voice-text');
const heard=panel.querySelector('.voice-heard'),agent=panel.querySelector('.voice-agent');

if(!SpeechRec){
 mic.hidden=true;typeToggle.hidden=true;typedForm.hidden=false;
 panel.querySelector('.voice-privacy').textContent='Dieser Browser bringt keine Spracherkennung mit, deshalb nimmt die Demo deine Wünsche als Text entgegen. Nichts davon wird gespeichert oder irgendwohin gesendet.';
}

function syncInputs(){
 const c=shell.querySelector('#calorie-target'),p=shell.querySelector('#protein-target');
 if(c&&demoState.calorieTarget!==null)c.value=demoState.calorieTarget;
 if(p&&demoState.proteinTarget!==null)p.value=demoState.proteinTarget;
}

// Liest heraus, was die Demo umsetzen kann, und sammelt für alles andere eine Rückfrage.
function parseWishes(text){
 const t=' '+text.toLowerCase().replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ')+' ';
 const applied=[],questions=[];

 let people=null;
 if(/ (allein|alleine|nur ich|für mich|für eine person|für 1) /.test(t))people=1;
 else if(/ (zu zweit|wir beide|für zwei|für 2|mein partner|meine partnerin) /.test(t))people=2;
 else{
  const collective={dritt:3,viert:4,fünft:5,sechst:6,siebt:7,acht:8};
  const words={ein:1,eine:1,eins:1,zwei:2,drei:3,vier:4,fünf:5,sechs:6,sieben:7,acht:8};
  const group=t.match(new RegExp(' zu ('+Object.keys(collective).join('|')+') '));
  const count='\\d+|'+Object.keys(words).join('|');
  const m=t.match(new RegExp(' (?:für|wir sind|sind) ('+count+') '))||t.match(new RegExp(' ('+count+') (?:personen|leute) '));
  if(group)people=collective[group[1]];
  else if(m)people=words[m[1]]||Number(m[1]);
 }
 if(people===1||people===2){demoState.people=people;applied.push(people===1?'eine Person':'zwei Personen');}
 else if(people!==null)questions.push({
  message:`Du hast ${people} Personen gesagt. Diese Demo plant für eine oder zwei — größere Tische kann die App.`,
  options:[{label:'Dann zwei Personen',apply(){demoState.people=2;}},{label:'Nur ich',apply(){demoState.people=1;}}]
 });

 const kcalMatch=t.match(/ (\d{2,6}) ?(?:kcal|kalorien) /)||t.match(/ kalorien (?:ziel |von |auf )?(\d{2,6}) /);
 if(kcalMatch){
  const kcal=Number(kcalMatch[1]);
  if(kcal>=1&&kcal<=10000){demoState.calorieTarget=kcal;applied.push(kcal+' kcal am Tag');}
  else questions.push({
   message:`${kcal} kcal liegt außerhalb dessen, was diese Demo rechnet (1 bis 10000).`,
   options:[{label:'Nimm 2000 kcal',apply(){demoState.calorieTarget=2000;}},{label:'Bei '+demoState.calorieTarget+' lassen',apply(){}}]
  });
 }

 const proteinMatch=t.match(/ (\d{1,4}) ?(?:g|gramm)? (?:protein|eiweiß|eiweiss) /)||t.match(/ (?:protein|eiweiß|eiweiss) (?:ziel |von |auf )?(\d{1,4}) /);
 if(proteinMatch){
  const protein=Number(proteinMatch[1]);
  if(protein>=1&&protein<=1000){demoState.proteinTarget=protein;applied.push(protein+' g Protein am Tag');}
  else questions.push({
   message:`${protein} g Protein liegt außerhalb dessen, was diese Demo rechnet (1 bis 1000).`,
   options:[{label:'Nimm 100 g',apply(){demoState.proteinTarget=100;}},{label:'Bei '+demoState.proteinTarget+' lassen',apply(){}}]
  });
 }

 const vegan=/ (vegan|pflanzlich|rein pflanzlich) /.test(t),vegetarian=vegan||/ (vegetarisch|fleischlos|kein fleisch|ohne fleisch) /.test(t);
 if(vegetarian){
  if(vegan){demoState.meal='oats';applied.push('pflanzliches Frühstück');}
  demoState.dinner='teriyaki';applied.push('Tofu am Abend');
  questions.push({
   message:'Beide Mittagessen dieser Demo enthalten Fleisch, einen komplett fleischlosen Tag bekomme ich hier nicht hin. Frühstück und Abendessen stehen.',
   options:[{label:'Passt, Mittag wähle ich',apply(){}},{label:'Zeig mir das Fleischgericht',apply(){demoState.step=0;}}]
  });
 }else if(/ (kein fisch|keinen fisch|ohne fisch|kein lachs) /.test(t)){demoState.dinner='teriyaki';applied.push('kein Fisch');}
 else if(/ (fisch|lachs) /.test(t)){demoState.dinner='salmon';applied.push('Lachs am Abend');}

 if(/ (rest|reste|vorrat|vorräte|hab noch|habe noch|aufbrauchen) /.test(t)){demoState.pantry=true;applied.push('Vorrat wird berücksichtigt');}

 const days=t.match(/ (\d+) tage? /);
 if((days&&Number(days[1])>1)||/ (eine |die )?woche /.test(t)||/ mehrere tage /.test(t))questions.push({
  message:'Diese Demo plant einen Tag mit Frühstück, Mittag- und Abendessen. Mehrere Tage am Stück plant die App.',
  options:[{label:'Weiter mit einem Tag',apply(){}}]
 });
 if(/ snacks? /.test(t))questions.push({
  message:'Snacks gehören zur App, nicht zu dieser Demo — hier geht es um Frühstück, Mittag- und Abendessen.',
  options:[{label:'Verstanden',apply(){}}]
 });

 return {applied,questions};
}

let pending=[];

function handleWishes(text){
 const clean=text.trim();
 if(!clean)return;
 heard.textContent='„'+clean+'“';
 const {applied,questions}=parseWishes(clean);
 if(!applied.length&&!questions.length){
  agent.innerHTML='<p class="voice-question">Daraus konnte ich nichts herauslesen. Sag zum Beispiel <em>„Wir sind zu zweit, 2000 kcal, kein Fisch“</em>.</p>';
  return;
 }
 demoState.step=0;
 syncInputs();renderDemo();
 agent.innerHTML=applied.length?`<p class="voice-applied">Eingestellt: ${applied.join(' · ')}</p>`:'';
 pending=questions;
 renderQuestion(Boolean(applied.length));
}

function renderQuestion(keepApplied){
 const summary=keepApplied?agent.querySelector('.voice-applied')?.outerHTML||'':'';
 if(!pending.length){
  agent.innerHTML=summary+'<p class="voice-question">Mehr kann ich von hier aus nicht einstellen.</p><button type="button" class="button voice-continue">Weiter zur Gerichteauswahl →</button>';
  return;
 }
 const q=pending[0];
 agent.innerHTML=summary+`<p class="voice-question">${q.message}</p><div class="voice-options">${q.options.map((o,i)=>`<button type="button" data-voice-option="${i}">${o.label}</button>`).join('')}</div>`;
}

// Die Demo behandelt Klicks im gesamten Abschnitt — unsere eigenen Knöpfe sollen dort kein zweites Rendern auslösen.
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
 micLabel.textContent='Wünsche sagen';
}
mic.addEventListener('click',()=>{
 if(listening){recognition.stop();return;}
 recognition=new SpeechRec();
 recognition.lang='de-DE';
 recognition.interimResults=true;
 recognition.maxAlternatives=1;
 recognition.onstart=()=>{listening=true;mic.setAttribute('aria-pressed','true');micLabel.textContent='Ich höre zu · beenden';heard.textContent='';agent.innerHTML='';};
 recognition.onresult=e=>{
  let text='';
  for(const result of e.results)text+=result[0].transcript;
  heard.textContent='„'+text.trim()+'“';
  if(e.results[e.results.length-1].isFinal)handleWishes(text);
 };
 recognition.onerror=e=>{
  stopListening();
  if(e.error==='aborted')return;
  const message=e.error==='not-allowed'||e.error==='service-not-allowed'
   ?'Dein Browser hat den Zugriff auf das Mikrofon nicht erlaubt. Du kannst deine Wünsche stattdessen tippen.'
   :e.error==='no-speech'?'Ich habe nichts gehört. Versuch es noch einmal oder tippe es ein.'
   :'Die Spracherkennung ist gerade nicht verfügbar. Tippen geht auch.';
  agent.innerHTML=`<p class="voice-question">${message}</p>`;
  typedForm.hidden=false;typeToggle.setAttribute('aria-expanded','true');
 };
 recognition.onend=stopListening;
 recognition.start();
});
})();
