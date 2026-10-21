/* App-Entwurf: generiert von design/app-entwurf/build.py aus den .dc.html-Entwürfen – nicht von Hand ändern. */
(function(){
var SCREENS = {};
SCREENS["Haushalt"] = { label: "Haushalt", title: "Haushalt anlegen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 24px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Wer isst bei euch mit?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Lege an, für wen du planst. Erwachsene und Kinder bekommen passende Portionen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{people}}\" as=\"p\" hint-placeholder-count=\"3\">\n<div style=\"display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 10px 12px 10px 14px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; border: 1.5px solid #E5E7EB\">\n<span style=\"{{p.avatar}}\">{{p.initial}}</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0\">\n<span style=\"font-size: 17px; font-weight: 600\">{{p.name}}</span>\n<span style=\"font-size: 13px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">{{p.portion}}</span>\n</span>\n<button onClick=\"{{p.toggle}}\" aria-label=\"{{p.toggleLabel}}\" style=\"{{p.chip}}\">{{p.kind}}</button>\n<button onClick=\"{{p.remove}}\" aria-label=\"{{p.removeLabel}}\" style=\"display: {{p.removeDisplay}}; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 999px; border: none; background: #F1F1EE; color: #64748B; font: inherit; font-size: 18px; cursor: pointer\">×</button>\n</div>\n</sc-for>\n<button onClick=\"{{add}}\" style=\"display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; border-radius: 16px; border: 1.5px dashed #CBD5CF; background: none; color: #0F6B3F; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer\">+ Person hinzufügen</button>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"></circle><path d=\"M3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 3 6\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Main.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
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
SCREENS["Main"] = { label: "Standard", title: "Mahlzeiten-Standard", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Welche Mahlzeiten planst du normalerweise?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Das gilt als Standard für jeden Tag. An einzelnen Tagen kannst du später abweichen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 12px\">\n<sc-for list=\"{{slots}}\" as=\"slot\" hint-placeholder-count=\"4\">\n<button onClick=\"{{slot.toggle}}\" style=\"{{slot.style}}\">\n<span style=\"display: flex; flex-direction: column; gap: 2px; text-align: left\">\n<span style=\"font-size: 17px; font-weight: 600; color: #1F2937\">{{slot.label}}</span>\n<span style=\"font-size: 14px; color: #64748B\">{{slot.hint}}</span>\n</span>\n<span style=\"{{slot.track}}\"><span style=\"{{slot.knob}}\"></span></span>\n</button>\n</sc-for>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Woche.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
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
toggle: () => st.set({ standard: Object.assign({}, on, { [d.id]: !active }), dayMeals: {} }),
style: 'display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 12px 16px; border-radius: 16px; cursor: pointer; font: inherit; background: ' + (active ? '#FFFFFF' : '#FFF8F0') + '; border: 1.5px solid ' + (active ? '#0F6B3F' : '#E5E7EB'),
track: 'display: flex; align-items: center; width: 52px; height: 32px; border-radius: 999px; padding: 3px; box-sizing: border-box; justify-content: ' + (active ? 'flex-end' : 'flex-start') + '; background: ' + (active ? '#0F6B3F' : '#CBD5CF'),
knob: 'width: 26px; height: 26px; border-radius: 999px; background: #FFFFFF'
};
})
};
}
}
return Component; } };
SCREENS["Woche"] = { label: "Woche", title: "Woche w\u00e4hlen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41 · 5.–11. OKTOBER</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Was steht diese Woche an?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Tippe die Tage an, die du planen willst.</p>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"7\">\n<button onClick=\"{{day.toggle}}\" style=\"{{day.style}}\">\n<span style=\"font-size: 14px; font-weight: 600\">{{day.short}}</span>\n<span style=\"font-size: 24px; font-weight: 700\">{{day.date}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"></rect><path d=\"M3 10h18M8 3v4M16 3v4\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"display: flex; align-items: baseline; justify-content: space-between\">\n<span style=\"font-size: 17px; font-weight: 600\">Steht etwas Besonderes an?</span>\n<span style=\"font-size: 13px; color: #64748B\">optional</span>\n</div>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{events}}\" as=\"ev\" hint-placeholder-count=\"4\">\n<button onClick=\"{{ev.toggle}}\" style=\"{{ev.style}}\">{{ev.label}}</button>\n</sc-for>\n<button style=\"min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px dashed #CBD5CF; background: none; color: #64748B; font: inherit; font-size: 15px; cursor: pointer\">+ Eigenes</button>\n</div>\n<sc-if value=\"{{baking}}\" hint-placeholder-val=\"{{ true }}\">\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Du wählst gleich ein Backrezept. Die Zutaten kommen mit in den Korb.</span>\n</sc-if>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<button onClick=\"{{start}}\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer\">Loslegen</button>\n</div>", make: function (DCLogic) {
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
start: () => { st.set({ dayPos: 0, slotPos: 0 }); this.props.go('Tag'); },
days: lib.SHORT.map((n, i) => {
const on = picked.indexOf(i) >= 0;
return {
short: n, date: String(5 + i),
toggle: () => st.set({ days: on ? picked.filter(x => x !== i) : picked.concat([i]), dayPos: 0 }),
style: 'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; height: 84px; border-radius: 16px; cursor: pointer; font: inherit; ' + (on ? 'background: #0F6B3F; color: #FFFFFF; border: 1.5px solid #0F6B3F' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #E5E7EB')
};
})
};
}
}
return Component; } };
SCREENS["Tag"] = { label: "Tag", title: "Tag anpassen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 24px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; gap: 8px\">\n<sc-for list=\"{{bars}}\" as=\"b\" hint-placeholder-count=\"4\"><span style=\"{{b.style}}\"></span></sc-for>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{eyebrow}}</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">{{title}}</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Vorausgewählt nach deinem Standard. Tippe weg, was heute anders ist.</p>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px\">\n<sc-for list=\"{{slots}}\" as=\"slot\" hint-placeholder-count=\"4\">\n<button onClick=\"{{slot.toggle}}\" style=\"{{slot.style}}\">\n<span style=\"{{slot.check}}\">\n<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n<span style=\"font-size: 17px; font-weight: 600\">{{slot.label}}</span>\n<span style=\"font-size: 13px; color: #64748B\">{{slot.state}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 8v5M12 16h.01\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<button onClick=\"{{next}}\" disabled=\"{{disabled}}\" style=\"{{nextStyle}}\">Gerichte wählen</button>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const days = lib.selectedDays(), day = lib.currentDay(), pos = Math.min(data.dayPos, Math.max(days.length - 1, 0));
const on = data.dayMeals[day] || data.standard;
const n = lib.SLOTS.filter(d => on[d.id]).length;
return {
eyebrow: days.length ? 'TAG ' + (pos + 1) + ' VON ' + days.length : 'KEIN TAG GEWÄHLT',
title: lib.DAY_NAMES[day] + ', ' + (5 + day) + '. Oktober',
bars: (days.length ? days : [0]).map((d, i) => ({ style: 'flex: 1; height: 6px; border-radius: 999px; background: ' + (lib.dayDone(d) ? '#0F6B3F' : i === pos ? '#F2B866' : '#E5E7EB') })),
summary: n + (n === 1 ? ' Mahlzeit' : ' Mahlzeiten') + ' heute. Für jede wählst du gleich ein Gericht oder entscheidest: nicht kochen.',
disabled: n === 0,
next: () => { st.set({ slotPos: 0 }); this.props.go('Wischen'); },
nextStyle: 'display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer; background: ' + (n ? '#0F6B3F' : '#CBD5CF') + '; color: #FFFFFF',
slots: lib.SLOTS.map(d => {
const active = !!on[d.id];
return {
label: d.label,
state: active ? 'wird geplant' : 'heute nicht',
toggle: () => {
const meals = Object.assign({}, data.dayMeals); meals[day] = Object.assign({}, on, { [d.id]: !active });
const plan = Object.assign({}, data.plan); if (active && plan[day]) { plan[day] = Object.assign({}, plan[day]); delete plan[day][d.id]; }
st.set({ dayMeals: meals, plan: plan });
},
style: 'display: flex; flex-direction: column; align-items: flex-start; gap: 6px; height: 112px; padding: 14px; box-sizing: border-box; border-radius: 16px; cursor: pointer; font: inherit; text-align: left; color: #1F2937; ' + (active ? 'background: #FFFFFF; border: 1.5px solid #0F6B3F' : 'background: #FFF8F0; border: 1.5px dashed #CBD5CF; opacity: 0.7'),
check: 'display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 999px; margin-bottom: auto; background: ' + (active ? '#0F6B3F' : '#CBD5CF')
};
})
};
}
}
return Component; } };
SCREENS["Wischen"] = { label: "Gericht", title: "Gericht w\u00e4hlen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 52px 24px 28px; display: flex; flex-direction: column; gap: 14px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 6px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{eyebrow}}</div>\n<h1 style=\"margin: 0; font-size: 26px; line-height: 32px; font-weight: 700\">{{question}}</h1>\n</div>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{chips}}\" as=\"c\" hint-placeholder-count=\"3\">\n<button onClick=\"{{c.jump}}\" style=\"{{c.style}}\">{{c.label}}</button>\n</sc-for>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{dishes}}\" as=\"dish\" hint-placeholder-count=\"2\">\n<button onClick=\"{{dish.pick}}\" aria-pressed=\"{{dish.pressed}}\" style=\"{{dish.style}}\">\n<span style=\"{{dish.photo}}\">\n<img src=\"{{dish.img}}\" alt=\"\" style=\"{{dish.imgStyle}}\">\n<sc-if value=\"{{dish.noImg}}\" hint-placeholder-val=\"{{ false }}\"><svg width=\"44\" height=\"44\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"position: absolute; left: 50%; top: 50%; margin: -22px 0 0 -22px\"><path d=\"M12 7c-1.5-1.2-4-1.4-5.6.2C4.6 9 5 13 6.6 16c1.2 2.2 2.8 3.8 4.4 3 .6-.3.9-.3 2 0 1.6.8 3.2-.8 4.4-3 1.6-3 2-7-.2-8.8C15.6 5.6 13.5 5.8 12 7z\"></path><path d=\"M12 7c0-1.8.8-3.2 2.4-4\"></path></svg></sc-if>\n<span style=\"{{dish.badge}}\">\n<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; padding: 10px 14px; text-align: left\">\n<span style=\"font-size: 16px; font-weight: 600; color: #1F2937\">{{dish.name}}</span>\n<span style=\"font-size: 13px; color: #64748B\">{{dish.parts}}</span>\n</span>\n</button>\n</sc-for>\n</div>\n<button onClick=\"{{more}}\" style=\"align-self: center; display: flex; align-items: center; gap: 6px; min-height: 40px; border: none; background: none; color: #0F6B3F; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5\"></path></svg>\nAndere zeigen\n</button>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; flex-direction: column; gap: 8px\">\n<div style=\"font-size: 13px; color: #64748B; text-align: center\">Oder nicht kochen</div>\n<div style=\"display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px\">\n<sc-for list=\"{{modes}}\" as=\"m\" hint-placeholder-count=\"3\">\n<button onClick=\"{{m.pick}}\" aria-pressed=\"{{m.pressed}}\" style=\"{{m.style}}\">{{m.label}}</button>\n</sc-for>\n</div>\n</div>\n<button onClick=\"{{next}}\" disabled=\"{{disabled}}\" style=\"{{nextStyle}}\">{{nextLabel}}</button>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const day = lib.currentDay(), slots = lib.mealsFor(day);
const pos = Math.min(data.slotPos, Math.max(slots.length - 1, 0)), slot = slots[pos] || lib.SLOTS[0];
const dayPlan = data.plan[day] || {}, entry = dayPlan[slot.id];
const choices = lib.CHOICES[slot.id], off = data.offset[slot.id] || 0;
const shown = [choices[off % choices.length], choices[(off + 1) % choices.length]];
const decide = e => { const plan = Object.assign({}, data.plan); plan[day] = Object.assign({}, dayPlan, { [slot.id]: e }); st.set({ plan: plan }); };
const last = pos >= slots.length - 1, nextSlot = slots[pos + 1];
const done = !!entry;
return {
eyebrow: lib.DAY_NAMES[day].toUpperCase() + ' · ' + (pos + 1) + ' VON ' + slots.length,
question: slot.q,
chips: slots.map((s, i) => {
const ok = !!dayPlan[s.id], cur = i === pos;
return { label: (ok ? '✓ ' : '') + s.short, jump: () => st.set({ slotPos: i }),
style: 'min-height: 34px; padding: 0 12px; border-radius: 999px; font: inherit; font-size: 13px; cursor: pointer; ' + (cur ? 'background: #1F2937; color: #FFFFFF; border: 1px solid #1F2937; font-weight: 600' : ok ? 'background: #EEF5F0; color: #0F6B3F; border: 1px solid #F6E7CF; font-weight: 600' : 'background: #FFFFFF; color: #64748B; border: 1px solid #E5E7EB') };
}),
dishes: shown.map(id => {
const dish = lib.DISHES[id], on = !!entry && entry.kind === 'cook' && entry.dish === id;
return {
name: dish.name, parts: dish.parts, img: dish.img || '', noImg: !dish.img, pressed: on ? 'true' : 'false',
pick: () => decide({ kind: 'cook', dish: id }),
style: 'display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: 18px; cursor: pointer; font: inherit; background: #FFFFFF; ' + (on ? 'border: 2.5px solid #0F6B3F' : 'border: 1.5px solid #E5E7EB'),
photo: 'position: relative; display: block; height: 104px; overflow: hidden; background: #F6E7CF',
imgStyle: 'position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: ' + (dish.img ? 'block' : 'none'),
badge: 'position: absolute; top: 10px; right: 10px; display: ' + (on ? 'flex' : 'none') + '; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 999px; background: #0F6B3F'
};
}),
more: () => st.set({ offset: Object.assign({}, data.offset, { [slot.id]: off + 1 }) }),
modes: [['skip', 'Überspringen'], ['heat', 'Aufwärmen'], ['out', 'Auswärts']].map(m => {
const on = !!entry && entry.kind === m[0];
return { label: m[1], pressed: on ? 'true' : 'false', pick: () => decide({ kind: m[0] }),
style: 'height: 46px; border-radius: 12px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB') };
}),
disabled: !done,
nextLabel: !done ? 'Erst ' + slot.label + ' wählen' : last ? lib.DAY_NAMES[day] + ' speichern' : 'Weiter zum ' + nextSlot.label,
next: () => { if (!done) return; if (last) { this.props.go('TagFertig'); } else { st.set({ slotPos: pos + 1 }); } },
nextStyle: 'display: flex; align-items: center; justify-content: center; height: 54px; border: none; border-radius: 999px; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer; color: #FFFFFF; background: ' + (done ? '#0F6B3F' : '#CBD5CF')
};
}
}
return Component; } };
SCREENS["TagFertig"] = { label: "Tag fertig", title: "Tag fertig", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 20px 32px; display: flex; flex-direction: column; gap: 18px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; align-items: center; gap: 14px; padding: 0 4px\">\n<span style=\"display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F\">\n<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px\">\n<h1 style=\"margin: 0; font-size: 24px; line-height: 30px; font-weight: 700\">{{headline}}</h1>\n<span style=\"font-size: 15px; color: #64748B\">{{remaining}}</span>\n</span>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px\">\n<sc-for list=\"{{week}}\" as=\"d\" hint-placeholder-count=\"7\">\n<span style=\"{{d.style}}\">\n<span style=\"font-size: 12px; font-weight: 600\">{{d.short}}</span>\n<span style=\"font-size: 17px; font-weight: 700\">{{d.date}}</span>\n<span style=\"{{d.mark}}\"></span>\n</span>\n</sc-for>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: #FFFFFF; border: 1.5px solid #0F6B3F\">\n<span style=\"font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #0F6B3F\">{{dayLabel}} · GESPEICHERT</span>\n<sc-for list=\"{{entries}}\" as=\"e\" hint-placeholder-count=\"3\">\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 15px\"><span style=\"width: 66px; flex-shrink: 0; font-size: 12px; color: #64748B\">{{e.slot}}</span><span style=\"{{e.dot}}\"></span><span style=\"overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">{{e.text}}</span></span>\n</sc-for>\n</div>\n<sc-if value=\"{{copied}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<span style=\"font-size: 15px; font-weight: 600\">{{copiedTitle}}</span>\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Gleiche Gerichte und Modi. Einzelne Mahlzeiten tauschst du im Kalender mit einem Tipp.</span>\n<button onClick=\"{{undo}}\" style=\"align-self: flex-start; min-height: 40px; padding: 0; border: none; background: none; color: #0F6B3F; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer\">Rückgängig</button>\n</div>\n</sc-if>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<button onClick=\"{{next}}\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border: none; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer\">{{nextLabel}}</button>\n<sc-if value=\"{{canCopy}}\" hint-placeholder-val=\"{{ true }}\">\n<button onClick=\"{{copy}}\" style=\"display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 999px; border: 1.5px solid #0F6B3F; background: #FFFFFF; color: #0F6B3F; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"></rect><path d=\"M5 15V6a2 2 0 0 1 2-2h9\"></path></svg>\n{{copyLabel}}\n</button>\n</sc-if>\n<a href=\"Wochenplan.dc.html\" style=\"display: flex; align-items: center; justify-content: center; min-height: 44px; color: #0F6B3F; font-size: 15px; font-weight: 600; text-decoration: none\">Zum Wochenkalender</a>\n</div>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const days = lib.selectedDays(), pos = Math.min(data.dayPos, Math.max(days.length - 1, 0)), day = days[pos] === undefined ? 0 : days[pos];
const nextDay = days[pos + 1], copiedTo = this.state.copiedTo;
const plan = data.plan[day] || {};
const dot = { cook: '#0F6B3F', heat: '#F2B866', out: 'transparent', skip: '#E5E7EB' };
const doneDays = days.filter(d => lib.dayDone(d));
const open = days.filter(d => !lib.dayDone(d)).map(d => lib.SHORT[d]);
const listText = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' und ' + arr[arr.length - 1];
return {
dayLabel: lib.DAY_NAMES[day].toUpperCase(),
headline: lib.dayDone(day) ? (copiedTo !== undefined ? lib.SHORT[day] + ' und ' + lib.SHORT[copiedTo] + ' stehen' : lib.DAY_NAMES[day] + ' ist geplant') : lib.DAY_NAMES[day] + ' ist noch offen',
remaining: open.length ? 'Noch offen: ' + listText(open) : 'Alle gewählten Tage sind geplant',
entries: lib.mealsFor(day).map(s => { const e = plan[s.id]; const k = e ? e.kind : 'skip';
return { slot: s.short, text: lib.entryText(e), dot: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; box-sizing: border-box; background: ' + dot[k] + (k === 'out' ? '; border: 1.5px solid #64748B' : '') }; }),
week: lib.SHORT.map((n, i) => {
const isDone = lib.dayDone(i), isChosen = days.indexOf(i) >= 0;
const base = 'display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-radius: 12px; ';
return { short: n, date: String(5 + i),
style: isDone ? base + 'background: #0F6B3F; color: #FFFFFF' : isChosen ? base + 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #0F6B3F' : base + 'background: #FFF8F0; color: #9CA3AF; border: 1px solid #E5E7EB',
mark: 'width: 6px; height: 6px; border-radius: 999px; background: ' + (isDone ? '#FFFFFF' : isChosen ? '#F2B866' : 'transparent') };
}),
copied: copiedTo !== undefined, copiedTitle: copiedTo !== undefined ? lib.DAY_NAMES[copiedTo] + ' übernommen' : '',
canCopy: nextDay !== undefined && copiedTo === undefined && lib.dayDone(day),
copyLabel: nextDay !== undefined ? lib.DAY_NAMES[nextDay] + ' wie ' + lib.DAY_NAMES[day] : '',
copy: () => {
const p = Object.assign({}, data.plan); p[nextDay] = JSON.parse(JSON.stringify(plan));
const m = Object.assign({}, data.dayMeals); m[nextDay] = Object.assign({}, data.dayMeals[day] || data.standard);
this.state.copiedTo = nextDay; st.set({ plan: p, dayMeals: m });
},
undo: () => { const p = Object.assign({}, data.plan); delete p[copiedTo]; this.state.copiedTo = undefined; st.set({ plan: p }); },
nextLabel: (function () { const after = days.slice(pos + 1).filter(d => !lib.dayDone(d))[0]; return after !== undefined ? 'Weiter mit ' + lib.DAY_NAMES[after] : 'Einkaufskorb erstellen'; })(),
next: () => {
const after = days.slice(pos + 1).filter(d => !lib.dayDone(d))[0];
this.state.copiedTo = undefined;
if (after !== undefined) { st.set({ dayPos: days.indexOf(after), slotPos: 0 }); this.props.go('Tag'); } else this.props.go('Korb');
}
};
}
}
return Component; } };
SCREENS["Wochenplan"] = { label: "Kalender", title: "Wochenkalender", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 20px 32px; display: flex; flex-direction: column; gap: 14px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 6px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Deine Woche</h1>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 8px; overflow: hidden\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"4\">\n<button onClick=\"{{day.open}}\" style=\"display: flex; gap: 14px; padding: 10px 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; color: #1F2937; font: inherit; text-align: left; cursor: pointer\">\n<span style=\"display: flex; flex-direction: column; align-items: center; width: 36px; flex-shrink: 0\">\n<span style=\"font-size: 13px; font-weight: 600; color: #64748B\">{{day.short}}</span>\n<span style=\"font-size: 22px; font-weight: 700\">{{day.date}}</span>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0\">\n<sc-for list=\"{{day.meals}}\" as=\"m\" hint-placeholder-count=\"3\">\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 14px; line-height: 18px\">\n<span style=\"width: 58px; flex-shrink: 0; font-size: 12px; color: #64748B\">{{m.slot}}</span>\n<span style=\"{{m.dot}}\"></span>\n<span style=\"{{m.textStyle}}\">{{m.text}}</span>\n</span>\n</sc-for>\n</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; gap: 8px\">\n<sc-for list=\"{{free}}\" as=\"f\" hint-placeholder-count=\"3\">\n<a href=\"Woche.dc.html\" style=\"flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 52px; border-radius: 14px; border: 1.5px dashed #CBD5CF; color: #64748B; text-decoration: none\">\n<span style=\"font-size: 13px; font-weight: 600\">{{f.short}} {{f.date}}</span>\n<span style=\"font-size: 12px\">+ planen</span>\n</a>\n</sc-for>\n</div>\n<div style=\"display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; font-size: 12px; color: #64748B\">\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #0F6B3F\"></span>kochen</span>\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #F2B866\"></span>aufwärmen</span>\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box\"></span>auswärts</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<a href=\"Korb.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Einkaufskorb erstellen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const st = this.props.store, lib = this.props.lib, data = st.data;
const days = lib.selectedDays();
const dot = {
cook: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F',
heat: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #F2B866',
out: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box',
skip: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #CBD5CF',
open: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #E5E7EB'
};
return {
days: days.map((d, i) => ({
short: lib.SHORT[d], date: String(5 + d),
open: () => { st.set({ dayPos: i, slotPos: 0 }); this.props.go(lib.dayDone(d) ? 'TagFertig' : 'Tag'); },
meals: lib.mealsFor(d).map(s => { const e = (data.plan[d] || {})[s.id]; const k = e ? e.kind : 'open';
return { slot: s.short, text: lib.entryText(e), dot: dot[k], textStyle: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ' + (k === 'open' ? 'color: #64748B; font-style: italic' : '') }; })
})),
free: lib.SHORT.map((n, i) => ({ short: n, date: String(5 + i), i: i })).filter(f => days.indexOf(f.i) < 0)
};
}
}
return Component; } };
SCREENS["Korb"] = { label: "Einkauf", title: "Einkaufskorb", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 48px 20px 28px; display: flex; flex-direction: column; gap: 12px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 4px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">{{range}}</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">Dein Einkauf</h1>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B\">{{subtitle}}</p>\n</div>\n<sc-if value=\"{{empty}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 16px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 16px; font-weight: 600\">Noch keine Gerichte gewählt</span>\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Plane zuerst einen Tag, dann erscheinen hier die Zutaten.</span>\n<a href=\"Tag.dc.html\" style=\"align-self: flex-start; min-height: 40px; display: flex; align-items: center; color: #0F6B3F; font-size: 15px; font-weight: 600; text-decoration: none\">Tag planen</a>\n</div>\n</sc-if>\n<sc-if value=\"{{hasItems}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; flex-direction: column; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; overflow: hidden\">\n<sc-for list=\"{{items}}\" as=\"item\" hint-placeholder-count=\"4\">\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 4px 14px; box-sizing: border-box; border-bottom: 1px solid #F1F1EE\">\n<span style=\"display: flex; flex-direction: column; gap: 1px; min-width: 0\">\n<span style=\"font-size: 15px; font-weight: 600\">{{item.name}}</span>\n<span style=\"font-size: 12px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">für {{item.for}}</span>\n</span>\n<span style=\"font-size: 13px; color: #64748B; flex-shrink: 0\">{{item.qty}}</span>\n</div>\n</sc-for>\n<sc-if value=\"{{hasMore}}\" hint-placeholder-val=\"{{ true }}\">\n<button onClick=\"{{toggleMore}}\" style=\"min-height: 42px; border: none; background: #FFFFFF; color: #0F6B3F; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer\">{{moreLabel}}</button>\n</sc-if>\n</div>\n</sc-if>\n<sc-if value=\"{{ready}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"width: 10px; height: 10px; border-radius: 999px; background: #F2B866; flex-shrink: 0\"></span>\n<span style=\"font-size: 14px; line-height: 20px\">{{readyText}}</span>\n</div>\n</sc-if>\n<sc-if value=\"{{baking}}\" hint-placeholder-val=\"{{ true }}\">\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 14px; background: #EEF5F0\">\n<span style=\"display: flex; flex-direction: column; gap: 1px\"><span style=\"font-size: 15px; font-weight: 600\">Kuchen backen</span><span style=\"font-size: 12px; color: #64748B\">Mehl · Zucker · Butter · Eier</span></span>\n<span style=\"font-size: 13px; color: #64748B\">4 Zutaten</span>\n</div>\n</sc-if>\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #64748B\">IMMER DABEI</span>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{regulars}}\" as=\"r\" hint-placeholder-count=\"5\">\n<button onClick=\"{{r.toggle}}\" aria-pressed=\"{{r.pressed}}\" style=\"{{r.style}}\">{{r.label}}</button>\n</sc-for>\n</div>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 16px\">\n<span style=\"display: flex; flex-direction: column\">\n<span style=\"font-size: 13px; color: #64748B\">Im Korb · {{extraCount}}</span>\n<span style=\"font-size: 20px; font-weight: 700\">{{total}} Artikel</span>\n</span>\n<a href=\"Wochenplan.dc.html\" style=\"display: flex; align-items: center; height: 54px; padding: 0 22px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 16px; font-weight: 600; text-decoration: none\">Zum Kalender</a>\n</div>\n</div>", make: function (DCLogic) {
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
window.SB_APP_SCREENS = SCREENS; window.SB_APP_ORDER = ["Haushalt", "Main", "Woche", "Tag", "Wischen", "TagFertig", "Wochenplan", "Korb"];
})();
