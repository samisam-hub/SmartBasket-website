/* SmartBasket guided planning prototype. Local state only; no AI/API, no persistence. */
(()=>{'use strict';
const root=document.getElementById('sb-agent-wizard');const demoPanel=document.getElementById('sb-agent-demo');if(!root||!demoPanel)return;
const steps=[
 {key:'week',question:'An welchen Tagen ist es bei euch besonders stressig?',type:'multi',options:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag','Keine stressigen Tage']},
 {key:'household',question:'Für wie viele Erwachsene und Kinder planst du?',type:'counter'},
 {key:'priority',question:'Was ist dir beim Essen besonders wichtig?',options:['Ausgewogen','Proteinreich','Preiswert','Schnell zubereitet']},
 {key:'diet',question:'Welche Ernährungsweise passt zu dir?',options:['Keine Einschränkung','Vegetarisch','Vegan','Laktosefrei']},
 {key:'meals',question:'Welche Mahlzeiten möchtest du einkaufen?',options:['Frühstück, Mittag- und Abendessen','Mittag- und Abendessen','Nur Abendessen','Flexibel entscheiden']},
 {key:'ideas',question:'Wie möchtest du Gerichte auswählen?',options:['Passende Vorschläge ansehen','Eigene Gerichte eintragen','Beides kombinieren']}
];
let index=0;const answers={household:{adults:2,children:0}};
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const head=el('div','sb-agent-head');const hwrap=el('div');hwrap.append(el('h2','', 'Plane deinen Einkauf Schritt für Schritt'),el('p','', 'Geführter Prototyp · keine KI und keine Anmeldung'));head.append(hwrap);
const body=el('div','sb-agent-body');const progress=el('div','sb-agent-progress');const track=el('div','sb-agent-track');const fill=el('div','sb-agent-fill');track.append(fill);
const question=el('h3','sb-agent-question');question.id='sb-agent-question';
const options=el('div','sb-agent-options');options.setAttribute('role','group');options.setAttribute('aria-labelledby',question.id);
const summary=el('div');const conversation=el('div','sb-agent-conversation');const actions=el('div','sb-agent-actions');
const back=el('button','sb-agent-btn sb-agent-back','← Zurück');back.type='button';
const next=el('button','sb-agent-btn','Weiter →');next.type='button';
const live=el('span','sb-agent-live');live.setAttribute('aria-live','polite');
actions.append(back,next);body.append(progress,track,conversation,question,options,summary,actions,live);
const shell=el('div','sb-agent-shell');shell.append(head,body);root.append(shell);
function render(){
 const done=index===steps.length;demoPanel.hidden=!done;progress.textContent=done?'Deine Angaben im Überblick':`Schritt ${index+1} von ${steps.length}`;
 fill.className='sb-agent-fill sb-agent-fill-'+(done?steps.length:index);
 options.replaceChildren();summary.replaceChildren();conversation.replaceChildren();for(let i=0;i<index;i++){const answer=answers[steps[i].key];if(!answer)continue;const label=typeof answer==='object'?(Array.isArray(answer)?answer.join(', '):answer.adults+' Erwachsene, '+answer.children+' Kinder'):answer;const bubble=el('div','sb-agent-user-bubble',label);conversation.append(bubble)}back.disabled=index===0;next.disabled=!done&&(!answers[steps[index].key]||(steps[index].type==='multi'&&!answers[steps[index].key].length)||(steps[index].type==='counter'&&answers.household.adults+answers.household.children===0));
 if(done){
  question.textContent='Jetzt deine Gerichte auswählen und Einkaufsliste erstellen.';
  const panel=el('div','sb-agent-summary');const dl=el('dl');
  for(const step of steps){dl.append(el('dt','',step.question),el('dd','',Array.isArray(answers[step.key])?answers[step.key].join(', '):step.type==='counter'?answers.household.adults+' Erwachsene, '+answers.household.children+' Kinder':answers[step.key]||'–'))}
  panel.append(dl);summary.append(panel,el('p','sb-agent-note','Wähle jetzt unten deine Gerichte aus. Die eingebettete SmartBasket-Demo berechnet daraus automatisch die Einkaufsliste und Packungsmengen. Wichtig: Die Demo nutzt weiterhin einen Beispielhaushalt und Montag/Dienstag; deine Antworten oben werden noch nicht in diese Berechnung übernommen.'));
  const link=el('a','pill-btn secondary','Gerichte auswählen und Einkaufsliste erstellen ↓');link.href='#demo';summary.append(link);
  next.textContent='Neu beginnen';next.disabled=false;
 }else{
  const step=steps[index];question.textContent=step.question;next.textContent=index===steps.length-1?'Zusammenfassung ansehen →':'Weiter →';
  if(step.type==='counter'){const value=answers.household;for(const [key,label] of [['adults','Erwachsene'],['children','Kinder']]){const row=el('div','sb-agent-counter');const title=el('strong','',label);const minus=el('button','sb-agent-count-btn','−');const count=el('output','',String(value[key]));const plus=el('button','sb-agent-count-btn','+');minus.type=plus.type='button';minus.setAttribute('aria-label',label+' verringern');plus.setAttribute('aria-label',label+' erhöhen');minus.disabled=value[key]===0;plus.disabled=value[key]>=12;minus.addEventListener('click',()=>{value[key]=Math.max(0,value[key]-1);render()});plus.addEventListener('click',()=>{value[key]=Math.min(12,value[key]+1);render()});row.append(title,minus,count,plus);options.append(row)}}else for(const value of step.options){const btn=el('button','sb-agent-option',value);btn.type='button';const selected=step.type==='multi'?(answers[step.key]||[]).includes(value):answers[step.key]===value;btn.setAttribute('aria-pressed',String(selected));btn.addEventListener('click',()=>{if(step.type==='multi'){let a=answers[step.key]||[];answers[step.key]=value==='Keine stressigen Tage'?['Keine stressigen Tage']:a.includes(value)?a.filter(x=>x!==value):[...a.filter(x=>x!=='Keine stressigen Tage'),value]}else answers[step.key]=value;render()});options.append(btn)}
 }
 live.textContent=done?'Planung abgeschlossen':`Schritt ${index+1}: ${steps[index].question}`;
}
back.addEventListener('click',()=>{if(index>0){index--;render();question.focus()}});
next.addEventListener('click',()=>{if(index===steps.length){for(const key of Object.keys(answers))delete answers[key];answers.household={adults:2,children:0};index=0}else if(answers[steps[index].key])index++;render();question.focus()});
question.tabIndex=-1;render();
})();
