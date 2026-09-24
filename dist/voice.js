// Voice-guided intake for the planning demo.
// Interpretation is local and deterministic by default. Point INTERPRET_ENDPOINT
// at a server-side proxy to have a model read the request instead; the API key
// belongs on that server and must never reach the browser. Any failure there
// falls back to the local interpreter, so the demo works offline either way.
(function(){
const shell=document.querySelector('#planning-demo .demo-shell');
if(!shell||typeof demoState==='undefined')return;

const INTERPRET_ENDPOINT=null;
const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
const MIC='<svg class="voice-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/><path fill="currentColor" d="M18 10.5a1 1 0 0 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.91V19H8.5a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2H13v-2.59a6 6 0 0 0 5-5.91Z"/></svg>';
const quote=t=>T.quoteOpen+t+T.quoteClose;
// A budget reads as a round figure, not an invoice.
const money=n=>euro(n).replace(/[.,]00(?!\d)/,'');

const LANG='en-US';
const T={
 eyebrow:'START BY SAYING IT',
 headline:'Tell SmartBasket what you need.',
 lead:'One sentence is enough: how many of you, how many days, what matters and what it may cost. The demo works out the rest and only asks back when something important is missing.',
 cta:'Tell SmartBasket what you need',
 close:'Close',
 hint:'Say something like',
 example:'Plan three days of dinners for two people, high protein, around €70, with one vegetarian meal.',
 start:'Start speaking',
 listening:'Listening…',
 waiting:'Waiting for you to start…',
 stop:'Stop',
 interpreting:'Working out what you need…',
 retry:'Start over',
 go:'Show the plan →',
 orType:'or type it instead',
 typedLabel:'Your request',
 placeholder:'Three days for two, high protein, around €70',
 send:'Send',
 noMic:'This browser has no built-in speech recognition, so the demo takes your request as text.',
 privacy:'Speech recognition is handled by your browser, which sends the recording to Google (Chrome) or Apple (Safari) to turn it into text. SmartBasket receives no audio and saves nothing. Typing works just as well.',
 errDenied:'Your browser did not allow microphone access. You can type your request instead.',
 errSilent:'I did not hear anything. Type it instead, or close this and try again.',
 errService:'Speech recognition is not available right now. Typing works too.',
 quoteOpen:'“',quoteClose:'”'
};

const NUMBERS={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
const COUNT='\\d+|'+Object.keys(NUMBERS).join('|');
const value=w=>NUMBERS[w]!==undefined?NUMBERS[w]:Number(w);

function mockInterpret(text){
 const t=' '+text.toLowerCase().replace(/[.,!?;:]/g,' ').replace(/\s+/g,' ')+' ';
 const p={days:null,people:null,budget:null,calorieTarget:null,proteinTarget:null,breakfast:null,lunch:null,dinner:null,pantry:false,notes:[]};
 let m;

 m=t.match(new RegExp(' ('+COUNT+') days? '));
 if(m)p.days=value(m[1]);
 else if(/ (a |the |one )?week /.test(t))p.days=7;

 if(/ (just me|only me|by myself|alone|for one|for 1) /.test(t))p.people=1;
 else if(/ (two of us|the two of us|for two|for 2|both of us|my partner) /.test(t))p.people=2;
 else{
  m=t.match(new RegExp(' (?:for|we are|there are) ('+COUNT+') '))||t.match(new RegExp(' ('+COUNT+') (?:people|persons|of us) '));
  if(m)p.people=value(m[1]);
 }

 m=t.match(/ € ?(\d{1,4})(?:[.,](\d{1,2}))? /)||t.match(/ (\d{1,4})(?:[.,](\d{1,2}))? ?(?:€|euros?|eur) /)||t.match(/ budget (?:of |around |about |under |at )?€? ?(\d{1,4})(?:[.,](\d{1,2}))? /);
 if(m)p.budget=Number(m[1]+(m[2]?'.'+m[2]:''));

 m=t.match(/ (\d{2,6}) ?(?:kcal|calories|cal) /)||t.match(/ calories? (?:target |of |at )?(\d{2,6}) /);
 if(m)p.calorieTarget=Number(m[1]);

 m=t.match(/ (\d{1,4}) ?(?:g|grams?)? (?:of )?protein /)||t.match(/ protein (?:target |of |at )?(\d{1,4}) /);
 if(m)p.proteinTarget=Number(m[1]);
 else if(/ (high[- ]protein|lots of protein|more protein|protein[- ]rich) /.test(t))p.proteinTarget=150;

 const vegan=/ (vegan|plant-based|plant based) /.test(t);
 const vegetarian=vegan||/ (vegetarian|veggie|meat-free|no meat) /.test(t);
 if(vegetarian){
  if(vegan)p.breakfast='oats';
  p.dinner='teriyaki';
  p.notes.push('veg');
 }else if(/ (no fish|without fish|no salmon) /.test(t))p.dinner='teriyaki';
 else if(/ (fish|salmon) /.test(t))p.dinner='salmon';

 if(/ (leftovers?|pantry|already have|still have|use up) /.test(t))p.pantry=true;
 if(/ snacks? /.test(t))p.notes.push('snacks');
 if(/ dinners? /.test(t))p.notes.push('dinners');
 return p;
}

// At most one follow-up, and only for something the demo genuinely cannot guess.
function clarification(p){
 if(p.people!==null&&(p.people<1||p.people>2))return {
  message:'This demo plans for one or two people — bigger tables are part of the app. Which should I use?',
  options:[{label:'Two people',apply(){p.people=2;}},{label:'Just me',apply(){p.people=1;}}]
 };
 if(p.people===null)return {
  message:'How many of you are eating?',
  options:[{label:'Just me',apply(){p.people=1;}},{label:'Two of us',apply(){p.people=2;}}]
 };
 if(p.days!==null&&p.days>7)return {
  message:'The demo plans up to seven days at a time. Shall I use seven?',
  options:[{label:'Seven days',apply(){p.days=7;}},{label:'Three days',apply(){p.days=3;}}]
 };
 return null;
}

function summarise(p){
 const s=demoState;
 let out='I’ll prepare a '+(s.days===1?'one-day':s.days+'-day')+' plan for '+(s.people===1?'one person':s.people+' people');
 let detail=false;
 if(p.notes.indexOf('veg')>=0){out+=' with a plant-based dinner';detail=true;}
 else if(s.proteinTarget>=130){out+=' with high-protein meals';detail=true;}
 if(s.budget!==null)out+=(detail?' and a ':' with a ')+money(s.budget)+' budget';
 return out+'.';
}

function factsList(){
 const s=demoState;
 const items=[['Days',s.days===1?'1 day':s.days+' days'],['People',s.people===1?'1 person':s.people+' people']];
 if(s.budget!==null)items.push(['Budget',money(s.budget)]);
 items.push(['Calories a day',s.calorieTarget+' kcal'],['Protein a day',s.proteinTarget+' g'],['Dinner',demoMeals[s.dinner].name]);
 return items.map(i=>'<li><span>'+i[0]+'</span><b>'+i[1]+'</b></li>').join('');
}

function notesLine(p){
 const out=[];
 if(p.notes.indexOf('dinners')>=0)out.push('This demo always plans breakfast, lunch and dinner together.');
 if(p.notes.indexOf('snacks')>=0)out.push('Snacks are part of the app, not of this demo.');
 if(p.notes.indexOf('veg')>=0)out.push('Both lunches here contain meat, so only breakfast and dinner could be made meat-free.');
 return out.length?'<p class="vd-note">'+out.join(' ')+'</p>':'';
}

// --- the invitation that sits above the planning steps ----------------------
const intake=document.createElement('div');
intake.className='voice-intake';
intake.innerHTML='<div class="eyebrow">'+T.eyebrow+'</div><h3>'+T.headline+'</h3><p>'+T.lead+'</p>'
 +'<button type="button" class="button voice-open">'+MIC+' '+T.cta+'</button>'
 +'<p class="voice-privacy">'+T.privacy+'</p>';
shell.prepend(intake);
// The demo delegates clicks across its whole section; keep ours from firing a second render.
intake.addEventListener('click',e=>{if(e.target.closest('button'))e.stopPropagation();});

const dialog=document.createElement('dialog');
dialog.className='voice-dialog';
dialog.innerHTML='<div class="vd-head"><h2>'+T.cta+'</h2><button type="button" class="vd-close" aria-label="'+T.close+'">&#215;</button></div><div class="vd-body"></div>';
document.body.append(dialog);
const body=dialog.querySelector('.vd-body');

// idle -> listening -> interpreting -> clarifying (only if needed) -> summary
let state='idle',transcript='',prefs=null,question=null,recognition=null,problem='';

function syncInputs(){
 const c=shell.querySelector('#calorie-target'),p=shell.querySelector('#protein-target');
 if(c&&demoState.calorieTarget!==null)c.value=demoState.calorieTarget;
 if(p&&demoState.proteinTarget!==null)p.value=demoState.proteinTarget;
}

function typedBlock(open){
 const toggle=SpeechRec?'<button type="button" class="vd-typed-toggle" aria-expanded="'+(open?'true':'false')+'">'+T.orType+'</button>':'';
 return toggle+'<form class="vd-form"'+(open?'':' hidden')+'><label for="vd-text">'+T.typedLabel+'</label><div><input id="vd-text" type="text" autocomplete="off" placeholder="'+T.placeholder+'"><button class="button" type="submit">'+T.send+'</button></div></form>';
}

function render(){
 let html='';
 if(state==='idle'){
  html='<p class="vd-hint">'+T.hint+' <em>'+quote(T.example)+'</em></p>'
   +(SpeechRec?'<div class="vd-stage"><button type="button" class="vd-mic">'+MIC+' '+T.start+'</button></div>':'<p class="vd-status">'+T.noMic+'</p>')
   +typedBlock(!SpeechRec)
   +'<p class="vd-privacy">'+T.privacy+'</p>';
 }else if(state==='listening'){
  html='<div class="vd-stage"><div class="vd-bars" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><p class="vd-status">'+T.listening+'</p></div>'
   +'<p class="vd-transcript" aria-live="polite"><span class="vd-dim">'+T.waiting+'</span></p>'
   +'<div class="vd-controls"><button type="button" class="button vd-stop">'+T.stop+'</button></div>';
 }else if(state==='interpreting'){
  html='<div class="vd-stage"><div class="vd-spinner" aria-hidden="true"></div><p class="vd-status">'+T.interpreting+'</p></div>'
   +'<p class="vd-transcript">'+quote(transcript)+'</p>';
 }else if(state==='clarifying'){
  html='<p class="vd-transcript">'+quote(transcript)+'</p>'
   +'<p class="vd-question" aria-live="polite">'+question.message+'</p>'
   +'<div class="vd-options">'+question.options.map((o,i)=>'<button type="button" data-opt="'+i+'">'+o.label+'</button>').join('')+'</div>'
   +'<div class="vd-controls"><button type="button" class="vd-retry">'+T.retry+'</button></div>';
 }else if(state==='summary'){
  html='<p class="vd-transcript">'+quote(transcript)+'</p>'
   +'<p class="vd-summary" aria-live="polite">'+summarise(prefs)+'</p>'
   +'<ul class="vd-facts">'+factsList()+'</ul>'+notesLine(prefs)
   +'<div class="vd-controls"><button type="button" class="button vd-go">'+T.go+'</button><button type="button" class="vd-retry">'+T.retry+'</button></div>';
 }else{
  html='<p class="vd-status vd-err">'+problem+'</p>'+typedBlock(true);
 }
 body.innerHTML=html;
}
function setState(next){state=next;render();}

function clampToDemo(p){
 if(p.people!==null)p.people=Math.min(2,Math.max(1,p.people));
 if(p.days!==null)p.days=Math.min(7,Math.max(1,p.days));
 if(p.calorieTarget!==null&&(p.calorieTarget<1||p.calorieTarget>10000))p.calorieTarget=null;
 if(p.proteinTarget!==null&&(p.proteinTarget<1||p.proteinTarget>1000))p.proteinTarget=null;
 if(p.budget!==null&&(p.budget<1||p.budget>10000))p.budget=null;
}

function apply(p){
 clampToDemo(p);
 if(p.people!==null)demoState.people=p.people;
 if(p.days!==null)demoState.days=p.days;
 if(p.budget!==null)demoState.budget=p.budget;
 if(p.calorieTarget!==null)demoState.calorieTarget=p.calorieTarget;
 if(p.proteinTarget!==null)demoState.proteinTarget=p.proteinTarget;
 if(p.breakfast)demoState.meal=p.breakfast;
 if(p.lunch)demoState.lunch=p.lunch;
 if(p.dinner)demoState.dinner=p.dinner;
 if(p.pantry)demoState.pantry=true;
 demoState.step=0;
 syncInputs();renderDemo();
}

// Tries the proxy when one is configured, and otherwise — or on any failure —
// uses the deterministic local interpreter.
function interpret(text){
 if(!INTERPRET_ENDPOINT)return new Promise(done=>setTimeout(()=>done(mockInterpret(text)),450));
 return fetch(INTERPRET_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:text,lang:LANG})})
  .then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
  .then(data=>Object.assign(mockInterpret(text),data))
  .catch(()=>mockInterpret(text));
}

function handle(){
 if(!transcript)return;
 setState('interpreting');
 interpret(transcript).then(p=>{
  prefs=p;
  question=clarification(p);
  if(question){setState('clarifying');return;}
  apply(p);setState('summary');
 });
}

body.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(!b)return;
 if(b.classList.contains('vd-mic'))startListening();
 else if(b.classList.contains('vd-stop'))stopListening();
 else if(b.classList.contains('vd-retry'))reset();
 else if(b.classList.contains('vd-go'))finish();
 else if(b.classList.contains('vd-typed-toggle')){
  const f=body.querySelector('.vd-form');
  f.hidden=!f.hidden;b.setAttribute('aria-expanded',String(!f.hidden));
  if(!f.hidden)f.querySelector('input').focus();
 }else if(b.dataset.opt!==undefined){
  question.options[Number(b.dataset.opt)].apply();
  apply(prefs);setState('summary');
 }
});
body.addEventListener('submit',e=>{
 e.preventDefault();
 const value=body.querySelector('#vd-text').value.trim();
 if(value){transcript=value;handle();}
});

function reset(){transcript='';prefs=null;question=null;problem='';setState('idle');}
function finish(){
 dialog.close();
 const first=shell.querySelector('[data-meal]');
 if(first){first.focus({preventScroll:true});first.scrollIntoView({block:'center',behavior:'smooth'});}
}

intake.querySelector('.voice-open').addEventListener('click',()=>{reset();dialog.showModal();});
dialog.querySelector('.vd-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('close',()=>{if(recognition){try{recognition.abort();}catch(err){}}});

function startListening(){
 if(!SpeechRec)return;
 recognition=new SpeechRec();
 recognition.lang=LANG;
 recognition.interimResults=true;
 recognition.maxAlternatives=1;
 recognition.onstart=()=>{transcript='';setState('listening');};
 recognition.onresult=e=>{
  let text='';
  for(const result of e.results)text+=result[0].transcript;
  transcript=text.trim();
  const el=body.querySelector('.vd-transcript');
  if(el)el.innerHTML=transcript?quote(transcript):'<span class="vd-dim">'+T.waiting+'</span>';
  if(e.results[e.results.length-1].isFinal){recognition.stop();handle();}
 };
 recognition.onerror=e=>{
  if(e.error==='aborted')return;
  problem=e.error==='not-allowed'||e.error==='service-not-allowed'?T.errDenied:e.error==='no-speech'?T.errSilent:T.errService;
  setState('error');
 };
 recognition.onend=()=>{if(state==='listening'&&!transcript)setState('idle');};
 recognition.start();
}
function stopListening(){
 if(recognition){try{recognition.stop();}catch(err){}}
 if(transcript)handle();else setState('idle');
}

render();
})();
