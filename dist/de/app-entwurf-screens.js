/* App-Entwurf: generiert von design/app-entwurf/build.py aus den .dc.html-Entwürfen – nicht von Hand ändern. */
(function(){
var SCREENS = {};
SCREENS["Haushalt"] = { label: "Haushalt", title: "Haushalt anlegen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 24px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Wer isst bei euch mit?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Lege an, für wen du planst. Erwachsene und Kinder bekommen passende Portionen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{people}}\" as=\"p\" hint-placeholder-count=\"3\">\n<div style=\"display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 10px 12px 10px 14px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; border: 1.5px solid #E5E7EB\">\n<span style=\"{{p.avatar}}\">{{p.initial}}</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0\">\n<span style=\"font-size: 17px; font-weight: 600\">{{p.name}}</span>\n<span style=\"font-size: 13px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">{{p.portion}}</span>\n</span>\n<button onClick=\"{{p.toggle}}\" aria-label=\"{{p.toggleLabel}}\" style=\"{{p.chip}}\">{{p.kind}}</button>\n<button onClick=\"{{p.remove}}\" aria-label=\"{{p.removeLabel}}\" style=\"display: {{p.removeDisplay}}; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 999px; border: none; background: #F1F1EE; color: #64748B; font: inherit; font-size: 18px; cursor: pointer\">×</button>\n</div>\n</sc-for>\n<button onClick=\"{{add}}\" style=\"display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; border-radius: 16px; border: 1.5px dashed #CBD5CF; background: none; color: #0F6B3F; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer\">+ Person hinzufügen</button>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"></circle><path d=\"M3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 3 6\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Budget.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, people = st.data.people;
const adults = people.filter(p => !p.kid).length, kids = people.length - adults;
const tints = ['#F6E7CF', '#EFE6D6', '#EEF5F0', '#E5E7EB'];
const parts = [];
if (adults) parts.push(adults + (adults === 1 ? ' erwachsene Person' : ' Erwachsene'));
if (kids) parts.push(kids + (kids === 1 ? ' Kind' : ' Kinder'));
const save = list => st.set({ people: list });
return {
summary: people.length ? parts.join(' und ') + ' · alle Mengen werden dafür berechnet.' : 'Noch niemand angelegt.',
add: () => save(people.concat([{ name: 'Person ' + (people.length + 1), kid: false }])),
people: people.map((p, i) => ({
name: p.name, initial: p.name.charAt(0), kind: p.kid ? 'Kind' : 'Erwachsen',
portion: p.kid ? 'kleine Portion' : 'große Portion',
toggleLabel: p.name + ': ' + (p.kid ? 'als erwachsen markieren' : 'als Kind markieren'),
removeLabel: p.name + ' entfernen', removeDisplay: people.length > 1 ? 'flex' : 'none',
toggle: () => save(people.map((q, j) => j === i ? { name: q.name, kid: !q.kid } : q)),
remove: () => save(people.filter((_, j) => j !== i)),
avatar: 'display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 999px; font-size: 18px; font-weight: 700; color: #1F2937; background: ' + tints[i % tints.length],
chip: 'min-height: 36px; padding: 0 12px; flex-shrink: 0; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; ' + (p.kid ? 'background: #EEF5F0; color: #0F6B3F; border: 1.5px solid #F6E7CF' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB')
}))
};
}
}
return Component; } };
SCREENS["Budget"] = { label: "Budget", title: "Budget und Unvertr\u00e4glichkeiten", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 52px 24px 28px; display: flex; flex-direction: column; gap: 20px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Budget und Unverträglichkeiten</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Damit nur Gerichte vorgeschlagen werden, die zu euch passen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<span style=\"font-size: 17px; font-weight: 600\">Budget pro Woche</span>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{budgets}}\" as=\"b\" hint-placeholder-count=\"5\">\n<button onClick=\"{{b.pick}}\" aria-pressed=\"{{b.pressed}}\" style=\"{{b.style}}\">{{b.label}}</button>\n</sc-for>\n</div>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<span style=\"font-size: 17px; font-weight: 600\">Was soll nicht auf den Tisch? <span style=\"font-size: 13px; font-weight: 400; color: #64748B\">· mehrere möglich</span></span>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{avoids}}\" as=\"a\" hint-placeholder-count=\"6\">\n<button onClick=\"{{a.toggle}}\" aria-pressed=\"{{a.pressed}}\" style=\"{{a.style}}\">{{a.label}}</button>\n</sc-for>\n</div>\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">{{avoidSummary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 13px; line-height: 18px; color: #64748B; text-align: center\">Prüfe bei Allergien trotzdem immer die Angaben auf der Verpackung.</p>\n<a href=\"Main.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; text-decoration: none; cursor: pointer\">Weiter</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const chip = on => 'min-height: 44px; padding: 0 16px; border-radius: 999px; font: inherit; font-size: 15px; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937; font-weight: 600' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB');
const av = data.avoids;
const names = lib.AVOIDS.filter(a => av.indexOf(a.id) >= 0).map(a => a.label);
return {
budgets: lib.BUDGETS.map(b => ({ label: b, pressed: data.budget === b ? 'true' : 'false', style: chip(data.budget === b), pick: () => st.set({ budget: b, generated: false }) })),
avoids: lib.AVOIDS.map(a => { const on = av.indexOf(a.id) >= 0;
return { label: (on ? '✕ ' : '') + a.label, pressed: on ? 'true' : 'false', style: chip(on),
toggle: () => st.set({ avoids: on ? av.filter(x => x !== a.id) : av.concat([a.id]), generated: false }) }; }),
avoidSummary: names.length ? 'Ohne ' + names.join(', ') + '. Passende Gerichte werden ausgefiltert.' : 'Keine Einschränkungen ausgewählt.'
};
}
}
return Component; } };
SCREENS["Main"] = { label: "Mahlzeiten", title: "Mahlzeiten-Standard", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Welche Mahlzeiten planst du normalerweise?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Das gilt als Standard für jeden Tag. An einzelnen Tagen kannst du später abweichen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 12px\">\n<sc-for list=\"{{slots}}\" as=\"slot\" hint-placeholder-count=\"4\">\n<button onClick=\"{{slot.toggle}}\" style=\"{{slot.style}}\">\n<span style=\"display: flex; flex-direction: column; gap: 2px; text-align: left\">\n<span style=\"font-size: 17px; font-weight: 600; color: #1F2937\">{{slot.label}}</span>\n<span style=\"font-size: 14px; color: #64748B\">{{slot.hint}}</span>\n</span>\n<span style=\"{{slot.track}}\"><span style=\"{{slot.knob}}\"></span></span>\n</button>\n</sc-for>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Woche.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, on = st.data.standard;
const defs = [
{ id: 'breakfast', label: 'Frühstück', hint: 'Morgens' },
{ id: 'lunch', label: 'Mittagessen', hint: 'Mittags' },
{ id: 'dinner', label: 'Abendessen', hint: 'Abends' },
{ id: 'snack', label: 'Snack', hint: 'Zwischendurch' }
];
return {
slots: defs.map(d => {
const active = !!on[d.id];
return {
label: d.label, hint: d.hint,
toggle: () => st.set({ standard: Object.assign({}, on, { [d.id]: !active }), generated: false, swipePos: 0 }),
style: 'display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 12px 16px; border-radius: 16px; cursor: pointer; font: inherit; background: ' + (active ? '#FFFFFF' : '#FFF8F0') + '; border: 1.5px solid ' + (active ? '#0F6B3F' : '#E5E7EB'),
track: 'display: flex; align-items: center; width: 52px; height: 32px; border-radius: 999px; padding: 3px; box-sizing: border-box; justify-content: ' + (active ? 'flex-end' : 'flex-start') + '; background: ' + (active ? '#0F6B3F' : '#CBD5CF'),
knob: 'width: 26px; height: 26px; border-radius: 999px; background: #FFFFFF'
};
})
};
}
}
return Component; } };
SCREENS["Woche"] = { label: "Woche", title: "Woche w\u00e4hlen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41 · 5.–11. OKTOBER</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Was steht diese Woche an?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Tippe die Tage an, die du planen willst.</p>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"7\">\n<button onClick=\"{{day.toggle}}\" style=\"{{day.style}}\">\n<span style=\"font-size: 14px; font-weight: 600\">{{day.short}}</span>\n<span style=\"font-size: 24px; font-weight: 700\">{{day.date}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"></rect><path d=\"M3 10h18M8 3v4M16 3v4\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"display: flex; align-items: baseline; justify-content: space-between\">\n<span style=\"font-size: 17px; font-weight: 600\">Steht etwas Besonderes an?</span>\n<span style=\"font-size: 13px; color: #64748B\">optional</span>\n</div>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{events}}\" as=\"ev\" hint-placeholder-count=\"4\">\n<button onClick=\"{{ev.toggle}}\" style=\"{{ev.style}}\">{{ev.label}}</button>\n</sc-for>\n<button style=\"min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px dashed #CBD5CF; background: none; color: #64748B; font: inherit; font-size: 15px; cursor: pointer\">+ Eigenes</button>\n</div>\n<sc-if value=\"{{baking}}\" hint-placeholder-val=\"{{ true }}\">\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Du wählst gleich ein Backrezept. Die Zutaten kommen mit in den Korb.</span>\n</sc-if>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<button onClick=\"{{start}}\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer\">Weiter zum Geschmack</button>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const ev = data.events, picked = data.days;
const count = picked.length;
const evDefs = [{ id: 'bake', label: 'Backen' }, { id: 'guests', label: 'Besuch' }, { id: 'party', label: 'Geburtstag' }];
return {
baking: !!ev.bake,
events: evDefs.map(e => {
const on = !!ev[e.id];
return {
label: e.label,
toggle: () => st.set({ events: Object.assign({}, ev, { [e.id]: !on }) }),
style: 'min-height: 44px; padding: 0 16px; border-radius: 999px; font: inherit; font-size: 15px; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937; font-weight: 600' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB')
};
}),
summary: count === 0 ? 'Noch kein Tag ausgewählt' : count + (count === 1 ? ' Tag' : ' Tage') + ' ausgewählt · der Rest bleibt frei',
start: () => { st.set({ swipeSlot: null, swipePos: 0 }); this.props.go('Geschmack'); },
days: lib.SHORT.map((n, i) => {
const on = picked.indexOf(i) >= 0;
return {
short: n, date: String(5 + i),
toggle: () => st.set({ days: on ? picked.filter(x => x !== i) : picked.concat([i]), generated: false }),
style: 'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; height: 84px; border-radius: 16px; cursor: pointer; font: inherit; ' + (on ? 'background: #0F6B3F; color: #FFFFFF; border: 1.5px solid #0F6B3F' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #E5E7EB')
};
})
};
}
}
return Component; } };
SCREENS["Geschmack"] = { label: "Geschmack", title: "Geschmack", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 52px 24px 28px; display: flex; flex-direction: column; gap: 20px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<sc-if value=\"{{overview}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">DEIN GESCHMACK</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">Was esst ihr gern?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Wähle eine Mahlzeit und wische durch die Vorschläge. Jede Runde dauert nur ein paar Sekunden.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{slots}}\" as=\"s\" hint-placeholder-count=\"3\">\n<button onClick=\"{{s.open}}\" aria-label=\"{{s.aria}}\" style=\"{{s.style}}\">\n<span style=\"{{s.photo}}\"><img src=\"{{s.img}}\" alt=\"\" style=\"position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover\"></span>\n<span style=\"display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; text-align: left\">\n<span style=\"font-size: 17px; font-weight: 600; color: #1F2937\">{{s.label}}</span>\n<span style=\"font-size: 13px; color: #64748B\">{{s.status}}</span>\n</span>\n<span style=\"{{s.badge}}\">{{s.action}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<span style=\"font-size: 13px; line-height: 18px; color: #64748B; text-align: center\">{{hint}}</span>\n<button onClick=\"{{create}}\" style=\"{{createStyle}}\">Plan erstellen</button>\n</sc-if>\n<sc-if value=\"{{session}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 8px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{eyebrow}}</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">{{title}}</h1>\n<div style=\"display: flex; gap: 4px\">\n<sc-for list=\"{{bars}}\" as=\"b\" hint-placeholder-count=\"5\"><span style=\"{{b.style}}\"></span></sc-for>\n</div>\n</div>\n<sc-if value=\"{{hasCard}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"position: relative; display: flex; flex-direction: column; border-radius: 24px; overflow: hidden; background: #FFFFFF; border: 1.5px solid #E5E7EB; box-shadow: 0 10px 24px -10px rgba(54,43,38,.25)\">\n<span style=\"position: relative; display: block; height: 300px; background: #F6E7CF\">\n<img src=\"{{card.img}}\" alt=\"\" style=\"{{card.imgStyle}}\">\n<sc-if value=\"{{card.noImg}}\" hint-placeholder-val=\"{{ false }}\"><svg width=\"64\" height=\"64\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"position: absolute; left: 50%; top: 50%; margin: -32px 0 0 -32px\"><path d=\"M12 7c-1.5-1.2-4-1.4-5.6.2C4.6 9 5 13 6.6 16c1.2 2.2 2.8 3.8 4.4 3 .6-.3.9-.3 2 0 1.6.8 3.2-.8 4.4-3 1.6-3 2-7-.2-8.8C15.6 5.6 13.5 5.8 12 7z\"></path><path d=\"M12 7c0-1.8.8-3.2 2.4-4\"></path></svg></sc-if>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 4px; padding: 14px 16px 16px\">\n<span style=\"font-size: 20px; font-weight: 700\">{{card.name}}</span>\n<span style=\"font-size: 14px; color: #64748B\">{{card.parts}}</span>\n</span>\n</div>\n<div style=\"display: flex; justify-content: center; gap: 40px\">\n<button onClick=\"{{nope}}\" aria-label=\"Mag ich nicht\" style=\"display: flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 999px; border: 2px solid #CBD5CF; background: #FFFFFF; color: #64748B; font: inherit; font-size: 26px; cursor: pointer\">✕</button>\n<button onClick=\"{{like}}\" aria-label=\"Mag ich\" style=\"display: flex; align-items: center; justify-content: center; width: 68px; height: 68px; border-radius: 999px; border: none; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 28px; cursor: pointer\">♥</button>\n</div>\n<button onClick=\"{{back}}\" style=\"{{backStyle}}\">↶ Zurück</button>\n</sc-if>\n<sc-if value=\"{{finished}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 20px; background: #FFFFFF; border: 1.5px solid #E5E7EB\">\n<span style=\"font-size: 17px; font-weight: 600\">{{doneTitle}}</span>\n<sc-for list=\"{{likedList}}\" as=\"l\" hint-placeholder-count=\"3\">\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 15px\"><span style=\"color: #0F6B3F\">♥</span>{{l.name}}</span>\n</sc-for>\n<button onClick=\"{{restart}}\" style=\"align-self: flex-start; min-height: 40px; padding: 0; border: none; background: none; color: #0F6B3F; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer\">Nochmal wischen</button>\n</div>\n</sc-if>\n<div style=\"flex-grow: 1\"></div>\n<button onClick=\"{{next}}\" style=\"{{nextStyle}}\">{{nextLabel}}</button>\n<button onClick=\"{{toOverview}}\" style=\"display: flex; align-items: center; justify-content: center; min-height: 40px; border: none; background: none; color: #64748B; font: inherit; font-size: 14px; cursor: pointer\">Zur Übersicht</button>\n</sc-if>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data, prefs = data.prefs;
const slots = lib.mealsFor();
const PRIMARY = 'display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer';
const SUBTLE = 'display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #FFFFFF; color: #0F6B3F; border: 1.5px solid #0F6B3F; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer';
const info = s => { const c = lib.candidates(s.id); const rated = c.filter(id => prefs[id] !== undefined).length; const liked = c.filter(id => prefs[id] === true).length;
const first = c.map(id => lib.DISHES[id]).filter(x => x.img)[0]; return { c: c, rated: rated, liked: liked, done: c.length > 0 && rated >= c.length, img: first ? first.img : '' }; };
const create = () => { st.set({ plan: lib.generate(), generated: true, swipeSlot: null }); this.props.go('Wochenplan'); };
const active = slots.filter(s => s.id === data.swipeSlot)[0];
const allDone = slots.every(s => info(s).done);
if (!active) {
return {
overview: true, session: false,
slots: slots.map(s => { const i = info(s);
return { label: s.label, img: i.img, aria: s.label + ' wischen',
status: i.done ? i.liked + (i.liked === 1 ? ' Gericht' : ' Gerichte') + ' gemerkt' : i.rated ? i.rated + ' von ' + i.c.length + ' bewertet' : i.c.length + ' Vorschläge',
action: i.done ? '✓' : 'Wischen',
open: () => st.set({ swipeSlot: s.id, swipePos: i.done ? 0 : i.rated }),
style: 'display: flex; align-items: center; gap: 14px; padding: 10px 14px 10px 10px; border-radius: 18px; cursor: pointer; font: inherit; background: #FFFFFF; ' + (i.done ? 'border: 1.5px solid #0F6B3F' : 'border: 1.5px solid #E5E7EB'),
photo: 'position: relative; display: block; width: 64px; height: 64px; flex-shrink: 0; overflow: hidden; border-radius: 14px; background: #F6E7CF',
badge: i.done ? 'display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 16px; font-weight: 700'
: 'flex-shrink: 0; padding: 8px 14px; border-radius: 999px; background: #EEF5F0; color: #0F6B3F; font-size: 14px; font-weight: 600' }; }),
hint: allDone ? 'Alles bewertet – jetzt den Plan erstellen.' : 'Du kannst auch ohne Wischen planen und später tauschen.',
create: create, createStyle: allDone ? PRIMARY : SUBTLE
};
}
const queue = lib.candidates(active.id);
const pos = Math.min(data.swipePos || 0, queue.length), cur = queue[pos];
const dish = cur ? lib.DISHES[cur] : null;
const rate = v => { const p = Object.assign({}, prefs); p[cur] = v; st.set({ prefs: p, swipePos: pos + 1, generated: false }); };
const liked = queue.filter(id => prefs[id] === true);
const nextSlot = slots.filter(s => s.id !== active.id && !info(s).done)[0];
return {
overview: false, session: true,
eyebrow: active.label.toUpperCase() + (cur ? ' · ' + (pos + 1) + ' VON ' + queue.length : ' · FERTIG'),
title: cur ? 'Was magst du?' : active.label + ' gespeichert',
bars: queue.map((id, i) => ({ style: 'flex: 1; height: 4px; border-radius: 999px; background: ' + (i < pos ? (prefs[id] ? '#0F6B3F' : '#CBD5CF') : i === pos ? '#F2B866' : '#E5E7EB') })),
hasCard: !!cur, finished: !cur,
card: dish ? { name: dish.name, parts: dish.parts, img: dish.img || '', noImg: !dish.img,
imgStyle: 'position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: ' + (dish.img ? 'block' : 'none') } : {},
like: () => rate(true), nope: () => rate(false),
back: () => st.set({ swipePos: Math.max(0, pos - 1) }),
backStyle: 'align-self: center; min-height: 36px; border: none; background: none; color: #64748B; font: inherit; font-size: 14px; cursor: pointer; visibility: ' + (pos > 0 ? 'visible' : 'hidden'),
doneTitle: liked.length + (liked.length === 1 ? ' Gericht' : ' Gerichte') + ' gemerkt',
likedList: liked.map(id => ({ name: lib.DISHES[id].name })),
restart: () => st.set({ swipePos: 0 }),
next: cur ? () => st.set({ swipeSlot: null }) : nextSlot ? () => st.set({ swipeSlot: nextSlot.id, swipePos: 0 }) : create,
nextLabel: cur ? 'Später weiter wischen' : nextSlot ? 'Weiter mit ' + nextSlot.label : 'Plan erstellen',
nextStyle: cur ? 'display: none' : PRIMARY,
toOverview: () => st.set({ swipeSlot: null })
};
}
}
return Component; } };
SCREENS["Wochenplan"] = { label: "Plan", title: "Wochenkalender", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 48px 20px 24px; display: flex; flex-direction: column; gap: 10px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 6px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41 · AUTOMATISCH GEPLANT</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">Deine Woche</h1>\n</div>\n<sc-if value=\"{{generated}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #EEF5F0; font-size: 13px; line-height: 18px\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><path d=\"M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z\"></path></svg>\n<span>{{note}}</span>\n</div>\n</sc-if>\n<sc-if value=\"{{notGenerated}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 10px; padding: 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 15px; line-height: 21px\">Noch kein Plan. Erstelle ihn aus deinen Vorlieben – du kannst danach jede Mahlzeit tauschen.</span>\n<button onClick=\"{{create}}\" style=\"align-self: flex-start; min-height: 44px; padding: 0 18px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer\">Plan erstellen</button>\n</div>\n</sc-if>\n<div style=\"display: flex; flex-direction: column; gap: 6px; overflow: hidden\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"5\">\n<div class=\"{{day.cls}}\" style=\"{{day.style}}\">\n<button onClick=\"{{day.open}}\" aria-label=\"{{day.aria}}\" style=\"display: flex; flex-direction: column; align-items: center; width: 34px; flex-shrink: 0; padding: 4px 0 0; border: none; border-radius: 10px; background: none; color: #1F2937; font: inherit; cursor: pointer\">\n<span style=\"font-size: 12px; font-weight: 600; color: #64748B\">{{day.short}}</span>\n<span style=\"font-size: 19px; font-weight: 700\">{{day.date}}</span>\n</button>\n<sc-if value=\"{{day.hint}}\" hint-placeholder-val=\"{{ false }}\">\n<span class=\"ae-hand\" aria-hidden=\"true\" style=\"position: absolute; left: 2px; top: -24px; display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 8px; border-radius: 999px; background: #1F2937; color: #FFFFFF; font-size: 12px; font-weight: 600; box-shadow: 0 6px 14px -6px rgba(54,43,38,.5); pointer-events: none\">\n<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 11V5.5a1.5 1.5 0 0 1 3 0V11\"></path><path d=\"M12 10.5V9a1.5 1.5 0 0 1 3 0v2\"></path><path d=\"M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4 15.6a1.6 1.6 0 0 1 2.4-2.1L9 16V11\"></path></svg>\n{{day.hintText}}\n</span>\n</sc-if>\n<span style=\"display: flex; flex-direction: column; gap: 0; flex: 1; min-width: 0\">\n<sc-for list=\"{{day.meals}}\" as=\"m\" hint-placeholder-count=\"3\">\n<button onClick=\"{{m.edit}}\" aria-label=\"{{m.aria}}\" style=\"display: flex; align-items: center; gap: 8px; min-height: 23px; padding: 1px 4px; border: none; border-radius: 8px; background: none; color: #1F2937; font: inherit; font-size: 13px; line-height: 17px; text-align: left; cursor: pointer\">\n<span style=\"width: 52px; flex-shrink: 0; font-size: 11px; color: #64748B\">{{m.slot}}</span>\n<span style=\"{{m.dot}}\"></span>\n<span style=\"{{m.textStyle}}\">{{m.text}}</span>\n<span style=\"margin-left: auto; flex-shrink: 0; font-size: 11px; color: #0F6B3F\">{{m.flag}}</span>\n</button>\n</sc-for>\n</span>\n</div>\n</sc-for>\n</div>\n<div style=\"text-align: center; font-size: 12px; color: #64748B\">{{tapHint}}</div>\n<div style=\"flex-grow: 1\"></div>\n<a href=\"Korb.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; text-decoration: none; cursor: pointer\">Einkaufskorb erstellen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const days = lib.selectedDays(), liked = Object.keys(data.prefs).filter(k => data.prefs[k]).length;
const dot = {
cook: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F',
heat: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #F2B866',
out: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box',
skip: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #CBD5CF',
open: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #E5E7EB'
};
const hintDay = days.indexOf(1) >= 0 ? 1 : days[1] !== undefined ? days[1] : days[0];
const showHint = data.generated && !data.hintSeen;
const av = lib.AVOIDS.filter(a => data.avoids.indexOf(a.id) >= 0).map(a => a.label);
return {
generated: data.generated, notGenerated: !data.generated,
tapHint: 'Tippe einen Tag oder eine Mahlzeit an, um zu tauschen.',
note: 'Aus ' + liked + (liked === 1 ? ' gemochtem Gericht' : ' gemochten Gerichten') + (av.length ? ', ohne ' + av.join(', ') : '') + ' · Budget ' + data.budget + '.',
create: () => st.set({ plan: lib.generate(), generated: true }),
days: days.map(d => { const hint = showHint && d === hintDay; return {
short: lib.SHORT[d], date: String(5 + d), hint: hint, hintText: lib.DAY_NAMES[d] + ' antippen', cls: hint ? 'ae-glow' : '',
aria: lib.DAY_NAMES[d] + ' öffnen und Mahlzeiten tauschen',
open: () => { st.set({ edit: { day: d, slot: lib.mealsFor()[0].id }, hintSeen: true }); this.props.go('Wischen'); },
style: 'position: relative; display: flex; gap: 10px; padding: 5px 10px 5px 8px; border-radius: 14px; background: #FFFFFF; ' + (hint ? 'border: 2px solid #0F6B3F; margin: 18px -1px 0' : 'border: 1px solid #E5E7EB'),
meals: lib.mealsFor().map(s => { const e = (data.plan[d] || {})[s.id]; const k = e ? e.kind : 'open';
return { slot: s.short, text: lib.entryText(e), dot: dot[k], flag: e && !e.auto ? 'geändert' : '',
aria: lib.DAY_NAMES[d] + ' ' + s.label + ': ' + lib.entryText(e) + ' – tauschen',
edit: () => { st.set({ edit: { day: d, slot: s.id }, hintSeen: true }); this.props.go('Wischen'); },
textStyle: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ' + (k === 'open' ? 'color: #64748B; font-style: italic' : '') }; })
}; })
};
}
}
return Component; } };
SCREENS["Wischen"] = { label: "Tauschen", title: "Mahlzeit tauschen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 52px 24px 28px; display: flex; flex-direction: column; gap: 14px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 6px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{eyebrow}}</div>\n<h1 style=\"margin: 0; font-size: 26px; line-height: 32px; font-weight: 700\">Mahlzeit tauschen</h1>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B\">Aktuell: {{currentText}}</p>\n</div>\n<div style=\"display: flex; gap: 6px\">\n<sc-for list=\"{{tabs}}\" as=\"t\" hint-placeholder-count=\"3\">\n<button onClick=\"{{t.pick}}\" aria-pressed=\"{{t.pressed}}\" style=\"{{t.style}}\">{{t.label}}</button>\n</sc-for>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 8px; overflow: hidden\">\n<sc-for list=\"{{dishes}}\" as=\"dish\" hint-placeholder-count=\"3\">\n<button onClick=\"{{dish.pick}}\" aria-pressed=\"{{dish.pressed}}\" style=\"{{dish.style}}\">\n<span style=\"{{dish.photo}}\"><img src=\"{{dish.img}}\" alt=\"\" style=\"{{dish.imgStyle}}\"></span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; text-align: left\">\n<span style=\"font-size: 15px; font-weight: 600; color: #1F2937\">{{dish.name}}</span>\n<span style=\"font-size: 12px; color: #64748B\">{{dish.meta}}</span>\n</span>\n<span style=\"{{dish.badge}}\"><svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg></span>\n</button>\n</sc-for>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; flex-direction: column; gap: 8px\">\n<div style=\"font-size: 13px; color: #64748B; text-align: center\">Oder nicht kochen</div>\n<div style=\"display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px\">\n<sc-for list=\"{{modes}}\" as=\"m\" hint-placeholder-count=\"3\">\n<button onClick=\"{{m.pick}}\" aria-pressed=\"{{m.pressed}}\" style=\"{{m.style}}\">{{m.label}}</button>\n</sc-for>\n</div>\n</div>\n<a href=\"Wochenplan.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; text-decoration: none; cursor: pointer\">Zurück zum Plan</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const days = lib.selectedDays(), meals = lib.mealsFor();
const target = data.edit && days.indexOf(data.edit.day) >= 0 && meals.some(m => m.id === data.edit.slot) ? data.edit : { day: days[0] === undefined ? 0 : days[0], slot: (meals[0] || lib.SLOTS[0]).id };
const slot = lib.SLOTS.filter(s => s.id === target.slot)[0], dayPlan = data.plan[target.day] || {}, entry = dayPlan[slot.id];
const decide = e => { const plan = Object.assign({}, data.plan); const dp = Object.assign({}, dayPlan); dp[slot.id] = Object.assign(e, { auto: false }); plan[target.day] = dp; st.set({ plan: plan }); };
return {
eyebrow: lib.DAY_NAMES[target.day].toUpperCase() + ' · ' + slot.label.toUpperCase(),
currentText: lib.entryText(entry),
tabs: meals.map(m => { const on = m.id === slot.id; return { label: m.short, pressed: on ? 'true' : 'false', pick: () => st.set({ edit: { day: target.day, slot: m.id }, hintSeen: true }),
style: 'flex: 1; height: 38px; border-radius: 999px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB') }; }),
dishes: lib.candidates(slot.id).map(id => {
const dish = lib.DISHES[id], on = !!entry && entry.kind === 'cook' && entry.dish === id, liked = data.prefs[id] === true, disliked = data.prefs[id] === false;
return { name: dish.name, img: dish.img || '', pressed: on ? 'true' : 'false',
meta: (liked ? '♥ gemerkt · ' : disliked ? 'nicht gemocht · ' : '') + dish.parts,
pick: () => decide({ kind: 'cook', dish: id }),
style: 'display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 8px; border-radius: 16px; cursor: pointer; font: inherit; background: #FFFFFF; ' + (on ? 'border: 2px solid #0F6B3F' : 'border: 1.5px solid #E5E7EB'),
photo: 'position: relative; display: block; width: 56px; height: 56px; flex-shrink: 0; overflow: hidden; border-radius: 12px; background: #F6E7CF',
imgStyle: 'position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: ' + (dish.img ? 'block' : 'none'),
badge: 'display: ' + (on ? 'flex' : 'none') + '; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F' };
}),
modes: [['skip', 'Überspringen'], ['heat', 'Aufwärmen'], ['out', 'Auswärts']].map(m => {
const on = !!entry && entry.kind === m[0];
return { label: m[1], pressed: on ? 'true' : 'false', pick: () => decide({ kind: m[0] }),
style: 'height: 46px; border-radius: 12px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB') };
})
};
}
}
return Component; } };
SCREENS["Korb"] = { label: "Einkauf", title: "Einkaufskorb", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 48px 20px 28px; display: flex; flex-direction: column; gap: 12px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 4px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{range}}</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">Dein Einkauf</h1>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B\">{{subtitle}}</p>\n</div>\n<sc-if value=\"{{empty}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 16px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 16px; font-weight: 600\">Noch keine Gerichte gewählt</span>\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Erstelle zuerst deinen Wochenplan, dann erscheinen hier die Zutaten.</span>\n<a href=\"Geschmack.dc.html\" style=\"align-self: flex-start; min-height: 40px; display: flex; align-items: center; color: #0F6B3F; font-size: 15px; font-weight: 600; text-decoration: none\">Zum Geschmack</a>\n</div>\n</sc-if>\n<sc-if value=\"{{hasItems}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; flex-direction: column; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; overflow: hidden\">\n<sc-for list=\"{{items}}\" as=\"item\" hint-placeholder-count=\"4\">\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 4px 14px; box-sizing: border-box; border-bottom: 1px solid #F1F1EE\">\n<span style=\"display: flex; flex-direction: column; gap: 1px; min-width: 0\">\n<span style=\"font-size: 15px; font-weight: 600\">{{item.name}}</span>\n<span style=\"font-size: 12px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">für {{item.for}}</span>\n</span>\n<span style=\"font-size: 13px; color: #64748B; flex-shrink: 0\">{{item.qty}}</span>\n</div>\n</sc-for>\n<sc-if value=\"{{hasMore}}\" hint-placeholder-val=\"{{ true }}\">\n<button onClick=\"{{toggleMore}}\" style=\"min-height: 42px; border: none; background: #FFFFFF; color: #0F6B3F; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer\">{{moreLabel}}</button>\n</sc-if>\n</div>\n</sc-if>\n<sc-if value=\"{{ready}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"width: 10px; height: 10px; border-radius: 999px; background: #F2B866; flex-shrink: 0\"></span>\n<span style=\"font-size: 14px; line-height: 20px\">{{readyText}}</span>\n</div>\n</sc-if>\n<sc-if value=\"{{baking}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 14px; background: #EEF5F0\">\n<span style=\"display: flex; flex-direction: column; gap: 1px\"><span style=\"font-size: 15px; font-weight: 600\">Kuchen backen</span><span style=\"font-size: 12px; color: #64748B\">Mehl · Zucker · Butter · Eier</span></span>\n<span style=\"font-size: 13px; color: #64748B\">4 Zutaten</span>\n</div>\n</sc-if>\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #64748B\">IMMER DABEI</span>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{regulars}}\" as=\"r\" hint-placeholder-count=\"5\">\n<button onClick=\"{{r.toggle}}\" aria-pressed=\"{{r.pressed}}\" style=\"{{r.style}}\">{{r.label}}</button>\n</sc-for>\n</div>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 16px\">\n<span style=\"display: flex; flex-direction: column\">\n<span style=\"font-size: 13px; color: #64748B\">Im Korb · {{extraCount}}</span>\n<span style=\"font-size: 20px; font-weight: 700\">{{total}} Artikel</span>\n</span>\n<a href=\"Wochenplan.dc.html\" style=\"display: flex; align-items: center; height: 54px; padding: 0 22px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none\">Zum Kalender</a>\n</div>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const on = data.extras, b = lib.basket(), people = lib.eaters();
const days = lib.selectedDays().filter(d => data.plan[d] && Object.keys(data.plan[d]).length);
const defs = [{ id: 'juice', label: 'Apfelsaft' }, { id: 'milk', label: 'Milch' }, { id: 'coffee', label: 'Kaffee' }, { id: 'bread', label: 'Brot' }, { id: 'cheese', label: 'Käse' }];
const n = defs.filter(d => on[d.id]).length, more = !!this.state.more, limit = 6;
const pp = [];
if (people.adults) pp.push(people.adults + (people.adults === 1 ? ' Erwachsene Person' : ' Erwachsene').replace('Erwachsene Person', 'erwachsene Person'));
if (people.kids) pp.push(people.kids + (people.kids === 1 ? ' Kind' : ' Kinder'));
const range = days.length ? days.map(d => lib.SHORT[d]).join(', ').toUpperCase() + ' · OKTOBER' : 'NOCH NICHTS GEPLANT';
return {
range: range,
subtitle: 'Mengen für ' + pp.join(' und ') + (data.events.bake ? ' · plus Backen' : ''),
empty: b.items.length === 0 && b.ready === 0,
hasItems: b.items.length > 0,
items: more ? b.items : b.items.slice(0, limit),
hasMore: b.items.length > limit,
moreLabel: more ? 'Weniger anzeigen' : (b.items.length - limit) + ' weitere Zutaten anzeigen',
toggleMore: () => this.setState({ more: !more }),
ready: b.ready > 0, readyText: b.ready + (b.ready === 1 ? ' Fertiggericht zum Aufwärmen' : ' Fertiggerichte zum Aufwärmen'),
baking: !!data.events.bake,
extraCount: n === 0 ? 'ohne Extras' : n + (n === 1 ? ' Extra' : ' Extras'),
total: b.items.length + (b.ready ? 1 : 0) + (data.events.bake ? 4 : 0) + n,
regulars: defs.map(d => { const active = !!on[d.id];
return { label: (active ? '✓ ' : '+ ') + d.label, pressed: active ? 'true' : 'false',
toggle: () => st.set({ extras: Object.assign({}, on, { [d.id]: !active }) }),
style: 'min-height: 38px; padding: 0 14px; border-radius: 999px; font: inherit; font-size: 14px; cursor: pointer; ' + (active ? 'background: #0F6B3F; color: #FFFFFF; border: 1.5px solid #0F6B3F; font-weight: 600' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB') }; })
};
}
}
return Component; } };
window.SB_APP_SCREENS = SCREENS; window.SB_APP_ORDER = ["Haushalt", "Budget", "Main", "Woche", "Geschmack", "Wochenplan", "Wischen", "Korb"];
})();
