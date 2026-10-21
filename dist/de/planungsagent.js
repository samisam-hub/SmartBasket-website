/* SmartBasket guided prototype: UI only. The existing meal demo is deliberately isolated. */
(()=>{'use strict';
const root=document.getElementById('sb-agent-wizard'),demoPanel=document.getElementById('sb-agent-demo');if(!root||!demoPanel)return;
const days=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const steps=[
 {key:'week',question:'Für welche Tage möchtest du Mahlzeiten planen?',type:'days'},
 {key:'household',question:'Für wie viele Erwachsene und Kinder planst du?',type:'counter'},
 {key:'budget',question:'Wie hoch ist dein Budget für die geplanten Mahlzeiten?',type:'single',options:['Unter 80 €','80–110 €','110–140 €','Über 140 €','Noch offen']},
 {key:'styles',question:'Welche Gerichte passen zu euch?',type:'styles',options:['Familienfreundlich','Italienisch','Hausmannskost','Schnelle Bowls','Vegetarisch','Abwechslungsreich']},
 {key:'time',question:'Wie viel Zeit möchtest du zum Kochen aufwenden?',type:'single',options:['20 Minuten','30 Minuten','45 Minuten','Flexibel']},
 {key:'avoids',question:'Gibt es Allergien oder Zutaten, die du vermeiden möchtest?',type:'avoids',options:['Keine','Erdnüsse','Schalenfrüchte','Milchprodukte','Gluten','Schalentiere','Andere']},
 {key:'pantry',question:'Welche Zutaten hast du bereits zu Hause?',type:'pantry'}
];
const answers={household:{adults:2,children:0}};let index=0;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const shell=el('div','sb-agent-shell'),head=el('div','sb-agent-head'),brand=el('div','sb-agent-brand'),logo=el('span','sb-agent-brand-icon','🧺'),title=el('div','sb-agent-brand-title','SmartBasket'),headStep=el('span','sb-agent-head-step');
brand.append(logo,title);head.append(brand,headStep);
const body=el('div','sb-agent-body'),top=el('div','sb-agent-top'),eyebrow=el('span','sb-agent-eyebrow','DEIN EINKAUFSASSISTENT'),progress=el('span','sb-agent-progress'),track=el('div','sb-agent-track'),fill=el('div','sb-agent-fill');
track.append(fill);top.append(eyebrow,progress);
const conversation=el('div','sb-agent-conversation'),prompt=el('div','sb-agent-prompt'),avatar=el('span','sb-agent-avatar','🥬'),question=el('h3','sb-agent-question');question.id='sb-agent-question';question.tabIndex=-1;prompt.append(avatar,question);
const options=el('div','sb-agent-options');options.setAttribute('role','group');options.setAttribute('aria-labelledby',question.id);
const summary=el('div'),actions=el('div','sb-agent-actions'),back=el('button','sb-agent-btn sb-agent-back','Zurück'),next=el('button','sb-agent-btn sb-agent-next','↑'),live=el('span','sb-agent-live');
back.type=next.type='button';next.setAttribute('aria-label','Weiter');live.setAttribute('aria-live','polite');actions.append(back,next);body.append(top,track,conversation,prompt,options,summary,actions,live);shell.append(head,body);root.append(shell);
function label(step){const a=answers[step.key];if(step.type==='counter')return a.adults+' Erwachsene, '+a.children+' Kinder';if(Array.isArray(a))return a.join(', ');if(step.type==='pantry')return a||'Keine Vorräte angegeben';if(step.type==='styles')return [a?.choices?.join(', '),a?.likes,a?.dislikes].filter(Boolean).join(' · ');return a||'–'}
function valid(step){const a=answers[step.key];if(step.type==='counter')return a.adults+a.children>0;if(step.type==='days'||step.type==='avoids')return Array.isArray(a)&&a.length>0;if(step.type==='styles')return !!(a&&(a.choices.length||a.likes||a.dislikes));return step.type==='pantry'||!!a}
function choose(step,value){const key=step.key,old=answers[key]||[],exclusive=step.type==='avoids'?'Keine':'Alle Tage';answers[key]=value===exclusive?[exclusive]:old.includes(value)?old.filter(v=>v!==value):[...old.filter(v=>v!==exclusive),value];render()}
function pill(step,value,selected,onClick){const btn=el('button','sb-agent-option',value);btn.type='button';btn.setAttribute('aria-pressed',String(selected));btn.addEventListener('click',onClick);options.append(btn)}
function field(labelText,placeholder,key){const wrap=el('label','sb-agent-field'),lbl=el('span','',labelText),input=el('input','sb-agent-input');input.type='text';input.placeholder=placeholder;input.value=answers.styles?.[key]||'';input.addEventListener('input',()=>{answers.styles[key]=input.value;next.disabled=!valid(steps[index])});wrap.append(lbl,input);options.append(wrap)}
function render(){
 const done=index===steps.length,step=steps[index];demoPanel.hidden=!done;headStep.textContent=done?'Fertig':(index+1)+' von '+steps.length;progress.textContent=done?'Dein Überblick':(index+1)+' von '+steps.length;fill.className='sb-agent-fill sb-agent-fill-'+(done?steps.length:index+1);
 conversation.replaceChildren();options.replaceChildren();summary.replaceChildren();
 if(index>0){const prev=steps[index-1];conversation.append(el('div','sb-agent-user-bubble',label(prev)))}
 back.disabled=index===0;next.disabled=!done&&!valid(step);
 if(done){prompt.hidden=true;question.textContent='';const box=el('div','sb-agent-summary'),heading=el('h3','','Deine Planung auf einen Blick'),dl=el('dl');box.append(heading);steps.forEach(st=>{dl.append(el('dt','',st.question),el('dd','',label(st)))});box.append(dl);summary.append(box,el('p','sb-agent-note','Die folgende Einkaufsdemo ist derzeit ein unabhängiges Beispiel mit Montag und Dienstag und einem festen Beispielhaushalt. Deine Angaben beeinflussen die Berechnung noch nicht.'));const link=el('a','sb-agent-demo-link','Zur Einkaufsdemo ↓');link.href='#demo';summary.append(link);next.textContent='↻';next.setAttribute('aria-label','Neu beginnen');next.disabled=false}
 else{prompt.hidden=false;question.textContent=index===0?'Ich helfe dir, deinen Einkauf zu planen. '+step.question:step.question;next.textContent='↑';next.setAttribute('aria-label',index===steps.length-1?'Zusammenfassung ansehen':'Weiter');
 if(step.type==='days'||step.type==='avoids'){options.classList.toggle('sb-agent-days',step.type==='days');for(const v of step.type==='days'?[...days,'Alle Tage']:step.options)pill(step,v,(answers[step.key]||[]).includes(v),()=>choose(step,v))}
 else{options.classList.remove('sb-agent-days');
 if(step.type==='counter'){const a=answers.household;for(const [key,labelText] of [['adults','Erwachsene'],['children','Kinder']]){const row=el('div','sb-agent-counter'),name=el('strong','',labelText),minus=el('button','sb-agent-count-btn','−'),count=el('output','',String(a[key])),plus=el('button','sb-agent-count-btn','+');minus.type=plus.type='button';minus.disabled=a[key]===0;plus.disabled=a[key]>=12;minus.setAttribute('aria-label',labelText+' verringern');plus.setAttribute('aria-label',labelText+' erhöhen');minus.addEventListener('click',()=>{a[key]=Math.max(0,a[key]-1);render()});plus.addEventListener('click',()=>{a[key]=Math.min(12,a[key]+1);render()});row.append(name,minus,count,plus);options.append(row)}}
 else if(step.type==='styles'){if(!answers.styles)answers.styles={choices:[],likes:'',dislikes:''};for(const v of step.options)pill(step,v,answers.styles.choices.includes(v),()=>{const a=answers.styles.choices;answers.styles.choices=a.includes(v)?a.filter(x=>x!==v):[...a,v];render()});field('Ein Gericht, das du gerne isst (optional)','z. B. Pasta mit Gemüse','likes');field('Was möchtest du vermeiden? (optional)','z. B. sehr scharfe Gerichte','dislikes')}
 else if(step.type==='pantry'){pill(step,'Nichts vorhanden',answers.pantry==='Nichts vorhanden',()=>{answers.pantry='Nichts vorhanden';render()});const wrap=el('label','sb-agent-field'),lbl=el('span','','Zutaten, die du bereits hast'),input=el('textarea','sb-agent-input');input.rows=3;input.placeholder='z. B. Reis, Nudeln, Karotten';input.value=answers.pantry==='Nichts vorhanden'?'':answers.pantry||'';input.addEventListener('input',()=>{answers.pantry=input.value;next.disabled=false});wrap.append(lbl,input);options.append(wrap)}
 else for(const v of step.options)pill(step,v,answers[step.key]===v,()=>{answers[step.key]=v;render()});
 }}
 live.textContent=done?'Zusammenfassung': 'Schritt '+(index+1)+' von '+steps.length;
}
back.addEventListener('click',()=>{if(index>0){index--;render();question.focus()}});
next.addEventListener('click',()=>{if(index===steps.length){for(const k of Object.keys(answers))delete answers[k];answers.household={adults:2,children:0};index=0}else if(valid(steps[index]))index++;render();if(index<steps.length)question.focus()});
render();
})();