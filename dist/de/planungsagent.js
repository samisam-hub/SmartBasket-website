/* SmartBasket guided planning prototype. Local state only; no AI/API, no persistence. */
(()=>{'use strict';
const root=document.getElementById('sb-agent');if(!root)return;
const steps=[
 {key:'people',question:'Für wie viele Personen kaufst du ein?',options:['1 Person','2 Personen','3–4 Personen','5 oder mehr']},
 {key:'days',question:'Für welchen Zeitraum möchtest du planen?',options:['2–3 Tage','5 Tage','7 Tage']},
 {key:'priority',question:'Was ist dir beim Essen besonders wichtig?',options:['Ausgewogen','Proteinreich','Preiswert','Schnell zubereitet']},
 {key:'diet',question:'Welche Ernährungsweise passt zu dir?',options:['Keine Einschränkung','Vegetarisch','Vegan','Laktosefrei']},
 {key:'meals',question:'Welche Mahlzeiten möchtest du einkaufen?',options:['Frühstück, Mittag- und Abendessen','Mittag- und Abendessen','Nur Abendessen','Flexibel entscheiden']},
 {key:'ideas',question:'Wie möchtest du Gerichte auswählen?',options:['Passende Vorschläge ansehen','Eigene Gerichte eintragen','Beides kombinieren']}
];
let index=0;const answers={};
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const head=el('div','sb-agent-head');const hwrap=el('div');hwrap.append(el('h2','', 'Plane deinen Einkauf Schritt für Schritt'),el('p','', 'Geführter Prototyp · keine KI und keine Anmeldung'));head.append(hwrap);
const body=el('div','sb-agent-body');const progress=el('div','sb-agent-progress');const track=el('div','sb-agent-track');const fill=el('div','sb-agent-fill');track.append(fill);
const question=el('h3','sb-agent-question');question.id='sb-agent-question';
const options=el('div','sb-agent-options');options.setAttribute('role','group');options.setAttribute('aria-labelledby',question.id);
const summary=el('div');const actions=el('div','sb-agent-actions');
const back=el('button','sb-agent-btn sb-agent-back','← Zurück');back.type='button';
const next=el('button','sb-agent-btn','Weiter →');next.type='button';
const live=el('span','sb-agent-live');live.setAttribute('aria-live','polite');
actions.append(back,next);body.append(progress,track,question,options,summary,actions,live);
const shell=el('div','sb-agent-shell');shell.append(head,body);root.append(shell);
function render(){
 const done=index===steps.length;progress.textContent=done?'Deine Angaben im Überblick':`Schritt ${index+1} von ${steps.length}`;
 fill.style.width=`${(done?1:index/steps.length)*100}%`;
 options.replaceChildren();summary.replaceChildren();back.disabled=index===0;next.disabled=!done&&!answers[steps[index].key];
 if(done){
  question.textContent='Deine Einkaufswünsche stehen fest.';
  const panel=el('div','sb-agent-summary');const dl=el('dl');
  for(const step of steps){dl.append(el('dt','',step.question),el('dd','',answers[step.key]||'–'))}
  panel.append(dl);summary.append(panel,el('p','sb-agent-note','Dies ist eine Planungsvorschau, noch kein berechneter Warenkorb. Als Nächstes kannst du die bestehende SmartBasket-Demo ausprobieren und Mahlzeiten sowie Mengen anpassen.'));
  const link=el('a','pill-btn secondary','Zur Einkaufsdemo ↓');link.href='#demo';summary.append(link);
  next.textContent='Neu beginnen';next.disabled=false;
 }else{
  const step=steps[index];question.textContent=step.question;next.textContent=index===steps.length-1?'Zusammenfassung ansehen →':'Weiter →';
  for(const value of step.options){const btn=el('button','sb-agent-option',value);btn.type='button';btn.setAttribute('aria-pressed',String(answers[step.key]===value));btn.addEventListener('click',()=>{answers[step.key]=value;render()});options.append(btn)}
 }
 live.textContent=done?'Planung abgeschlossen':`Schritt ${index+1}: ${steps[index].question}`;
}
back.addEventListener('click',()=>{if(index>0){index--;render();question.focus()}});
next.addEventListener('click',()=>{if(index===steps.length){for(const key of Object.keys(answers))delete answers[key];index=0}else if(answers[steps[index].key])index++;render();question.focus()});
question.tabIndex=-1;render();
})();
