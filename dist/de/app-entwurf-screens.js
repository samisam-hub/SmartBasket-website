/* App-Entwurf: generiert von design/app-entwurf/build.py aus den .dc.html-Entwürfen – nicht von Hand ändern. */
(function(){
var SCREENS = {};
SCREENS["Haushalt"] = { label: "Haushalt", title: "Haushalt anlegen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 24px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Wer isst bei euch mit?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Lege an, für wen du planst. Erwachsene und Kinder bekommen passende Portionen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{people}}\" as=\"p\" hint-placeholder-count=\"3\">\n<div style=\"display: flex; align-items: center; gap: 12px; min-height: 68px; padding: 10px 12px 10px 14px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; border: 1.5px solid #E5E7EB\">\n<span style=\"{{p.avatar}}\">{{p.initial}}</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0\">\n<span style=\"font-size: 17px; font-weight: 600\">{{p.name}}</span>\n<span style=\"font-size: 13px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">{{p.portion}}</span>\n</span>\n<button onClick=\"{{p.toggle}}\" aria-label=\"{{p.toggleLabel}}\" style=\"{{p.chip}}\">{{p.kind}}</button>\n<button onClick=\"{{p.remove}}\" aria-label=\"{{p.removeLabel}}\" style=\"display: {{p.removeDisplay}}; align-items: center; justify-content: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 999px; border: none; background: #F1F1EE; color: #64748B; font: inherit; font-size: 18px; cursor: pointer\">×</button>\n</div>\n</sc-for>\n<button onClick=\"{{add}}\" style=\"display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 56px; border-radius: 16px; border: 1.5px dashed #CBD5CF; background: none; color: #0F6B3F; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer\">+ Person hinzufügen</button>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"></circle><path d=\"M3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 3 6\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Main.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { people: [{ name: 'Anna', kid: false }, { name: 'Alex', kid: false }, { name: 'Mia', kid: true }] };
}
renderVals() {
const people = this.state.people;
const adults = people.filter(p => !p.kid).length;
const kids = people.length - adults;
const tints = ['#F6E7CF', '#EFE6D6', '#EEF5F0', '#E5E7EB'];
const parts = [];
if (adults) parts.push(adults + (adults === 1 ? ' erwachsene Person' : ' Erwachsene'));
if (kids) parts.push(kids + (kids === 1 ? ' Kind' : ' Kinder'));
return {
summary: people.length ? parts.join(' und ') + ' · alle Mengen werden dafür berechnet.' : 'Noch niemand angelegt.',
add: () => this.setState({ people: people.concat([{ name: 'Person ' + (people.length + 1), kid: false }]) }),
people: people.map((p, i) => ({
name: p.name,
initial: p.name.charAt(0),
kind: p.kid ? 'Kind' : 'Erwachsen',
portion: p.kid ? 'kleine Portion' : 'große Portion',
toggleLabel: p.name + ': ' + (p.kid ? 'als erwachsen markieren' : 'als Kind markieren'),
removeLabel: p.name + ' entfernen',
removeDisplay: people.length > 1 ? 'flex' : 'none',
toggle: () => this.setState({ people: people.map((q, j) => j === i ? { name: q.name, kid: !q.kid } : q) }),
remove: () => this.setState({ people: people.filter((_, j) => j !== i) }),
avatar: 'display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 999px; font-size: 18px; font-weight: 700; color: #1F2937; background: ' + tints[i % tints.length],
chip: 'min-height: 36px; padding: 0 12px; flex-shrink: 0; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; ' + (p.kid ? 'background: #EEF5F0; color: #0F6B3F; border: 1.5px solid #F6E7CF' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB')
}))
};
}
}
return Component; } };
SCREENS["Main"] = { label: "Standard", title: "Mahlzeiten-Standard", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">EINMAL EINRICHTEN</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Welche Mahlzeiten planst du normalerweise?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Das gilt als Standard für jeden Tag. An einzelnen Tagen kannst du später abweichen.</p>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 12px\">\n<sc-for list=\"{{slots}}\" as=\"slot\" hint-placeholder-count=\"4\">\n<button onClick=\"{{slot.toggle}}\" style=\"{{slot.style}}\">\n<span style=\"display: flex; flex-direction: column; gap: 2px; text-align: left\">\n<span style=\"font-size: 17px; font-weight: 600; color: #1F2937\">{{slot.label}}</span>\n<span style=\"font-size: 14px; color: #64748B\">{{slot.hint}}</span>\n</span>\n<span style=\"{{slot.track}}\"><span style=\"{{slot.knob}}\"></span></span>\n</button>\n</sc-for>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B; text-align: center\">Jederzeit im Profil änderbar</p>\n<a href=\"Woche.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { on: { breakfast: true, lunch: true, dinner: true, snack: false } };
}
renderVals() {
const defs = [
{ id: 'breakfast', label: 'Frühstück', hint: 'Morgens' },
{ id: 'lunch', label: 'Mittagessen', hint: 'Mittags' },
{ id: 'dinner', label: 'Abendessen', hint: 'Abends' },
{ id: 'snack', label: 'Snack', hint: 'Zwischendurch' }
];
const on = this.state.on;
return {
slots: defs.map(d => {
const active = on[d.id];
return {
label: d.label,
hint: d.hint,
toggle: () => this.setState({ on: Object.assign({}, on, { [d.id]: !active }) }),
style: 'display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; padding: 12px 16px; border-radius: 16px; cursor: pointer; font: inherit; background: ' + (active ? '#FFFFFF' : '#FFF8F0') + '; border: 1.5px solid ' + (active ? '#0F6B3F' : '#E5E7EB'),
track: 'display: flex; align-items: center; width: 52px; height: 32px; border-radius: 999px; padding: 3px; box-sizing: border-box; justify-content: ' + (active ? 'flex-end' : 'flex-start') + '; background: ' + (active ? '#0F6B3F' : '#CBD5CF'),
knob: 'width: 26px; height: 26px; border-radius: 999px; background: #FFFFFF'
};
})
};
}
}
return Component; } };
SCREENS["Woche"] = { label: "Woche", title: "Woche w\u00e4hlen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 28px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41 · 5.–11. OKTOBER</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Was steht diese Woche an?</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Tippe die Tage an, die du planen willst.</p>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"7\">\n<button onClick=\"{{day.toggle}}\" style=\"{{day.style}}\">\n<span style=\"font-size: 14px; font-weight: 600\">{{day.short}}</span>\n<span style=\"font-size: 24px; font-weight: 700\">{{day.date}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"></rect><path d=\"M3 10h18M8 3v4M16 3v4\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"display: flex; align-items: baseline; justify-content: space-between\">\n<span style=\"font-size: 17px; font-weight: 600\">Steht etwas Besonderes an?</span>\n<span style=\"font-size: 13px; color: #64748B\">optional</span>\n</div>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{events}}\" as=\"ev\" hint-placeholder-count=\"4\">\n<button onClick=\"{{ev.toggle}}\" style=\"{{ev.style}}\">{{ev.label}}</button>\n</sc-for>\n<button style=\"min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px dashed #CBD5CF; background: none; color: #64748B; font: inherit; font-size: 15px; cursor: pointer\">+ Eigenes</button>\n</div>\n<sc-if value=\"{{baking}}\" hint-placeholder-val=\"{{ true }}\">\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Du wählst gleich ein Backrezept. Die Zutaten kommen mit in den Korb.</span>\n</sc-if>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<a href=\"Tag.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Loslegen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { picked: { 0: true, 1: true, 2: true, 3: true }, events: { bake: true } };
}
renderVals() {
const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const picked = this.state.picked;
const ev = this.state.events;
const count = names.filter((_, i) => picked[i]).length;
const evDefs = [{ id: 'bake', label: 'Backen' }, { id: 'guests', label: 'Besuch' }, { id: 'party', label: 'Geburtstag' }];
return {
baking: !!ev.bake,
events: evDefs.map(e => {
const on = !!ev[e.id];
return {
label: e.label,
toggle: () => this.setState({ events: Object.assign({}, ev, { [e.id]: !on }) }),
style: 'min-height: 44px; padding: 0 16px; border-radius: 999px; font: inherit; font-size: 15px; cursor: pointer; ' + (on ? 'background: #1F2937; color: #FFFFFF; border: 1.5px solid #1F2937; font-weight: 600' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB')
};
}),
summary: count === 0 ? 'Noch kein Tag ausgewählt' : count + (count === 1 ? ' Tag' : ' Tage') + ' ausgewählt · der Rest bleibt frei',
days: names.map((n, i) => {
const on = !!picked[i];
return {
short: n,
date: String(5 + i),
toggle: () => this.setState({ picked: Object.assign({}, picked, { [i]: !on }) }),
style: 'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; height: 84px; border-radius: 16px; cursor: pointer; font: inherit; ' + (on ? 'background: #0F6B3F; color: #FFFFFF; border: 1.5px solid #0F6B3F' : 'background: #FFFFFF; color: #64748B; border: 1.5px solid #E5E7EB')
};
})
};
}
}
return Component; } };
SCREENS["Tag"] = { label: "Tag", title: "Tag anpassen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 24px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; gap: 8px\">\n<span style=\"flex: 1; height: 6px; border-radius: 999px; background: #0F6B3F\"></span>\n<span style=\"flex: 1; height: 6px; border-radius: 999px; background: #E5E7EB\"></span>\n<span style=\"flex: 1; height: 6px; border-radius: 999px; background: #E5E7EB\"></span>\n<span style=\"flex: 1; height: 6px; border-radius: 999px; background: #E5E7EB\"></span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">TAG 1 VON 4</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Montag, 5. Oktober</h1>\n<p style=\"margin: 0; font-size: 16px; line-height: 24px; color: #64748B\">Vorausgewählt nach deinem Standard. Tippe weg, was heute anders ist.</p>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px\">\n<sc-for list=\"{{slots}}\" as=\"slot\" hint-placeholder-count=\"4\">\n<button onClick=\"{{slot.toggle}}\" style=\"{{slot.style}}\">\n<span style=\"{{slot.check}}\">\n<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n<span style=\"font-size: 17px; font-weight: 600\">{{slot.label}}</span>\n<span style=\"font-size: 13px; color: #64748B\">{{slot.state}}</span>\n</button>\n</sc-for>\n</div>\n<div style=\"display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#0F6B3F\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex-shrink: 0\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 8v5M12 16h.01\"></path></svg>\n<span style=\"font-size: 15px; line-height: 22px\">{{summary}}</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<a href=\"Wischen.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Gerichte wählen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { on: { breakfast: true, lunch: true, dinner: true, snack: false } };
}
renderVals() {
const defs = [
{ id: 'breakfast', label: 'Frühstück' },
{ id: 'lunch', label: 'Mittagessen' },
{ id: 'dinner', label: 'Abendessen' },
{ id: 'snack', label: 'Snack' }
];
const on = this.state.on;
const n = defs.filter(d => on[d.id]).length;
return {
summary: n + (n === 1 ? ' Mahlzeit' : ' Mahlzeiten') + ' heute. Für jede wählst du gleich zwischen zwei Gerichten oder entscheidest: nicht kochen.',
slots: defs.map(d => {
const active = on[d.id];
return {
label: d.label,
state: active ? 'wird geplant' : 'heute nicht',
toggle: () => this.setState({ on: Object.assign({}, on, { [d.id]: !active }) }),
style: 'display: flex; flex-direction: column; align-items: flex-start; gap: 6px; height: 112px; padding: 14px; box-sizing: border-box; border-radius: 16px; cursor: pointer; font: inherit; text-align: left; color: #1F2937; ' + (active ? 'background: #FFFFFF; border: 1.5px solid #0F6B3F' : 'background: #FFF8F0; border: 1.5px dashed #CBD5CF; opacity: 0.7'),
check: 'display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 999px; margin-bottom: auto; background: ' + (active ? '#0F6B3F' : '#CBD5CF')
};
})
};
}
}
return Component; } };
SCREENS["Wischen"] = { label: "Gericht", title: "Gericht w\u00e4hlen", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 24px 32px; display: flex; flex-direction: column; gap: 20px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 8px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">MONTAG · 1 VON 3</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Was gibt es zum Frühstück?</h1>\n</div>\n<div style=\"display: flex; gap: 8px\">\n<span style=\"padding: 6px 12px; border-radius: 999px; background: #1F2937; color: #FFFFFF; font-size: 13px; font-weight: 600\">Frühstück</span>\n<span style=\"padding: 6px 12px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E5E7EB; color: #64748B; font-size: 13px\">Mittag</span>\n<span style=\"padding: 6px 12px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E5E7EB; color: #64748B; font-size: 13px\">Abend</span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 14px\">\n<sc-for list=\"{{dishes}}\" as=\"dish\" hint-placeholder-count=\"2\">\n<button onClick=\"{{dish.pick}}\" style=\"{{dish.style}}\">\n<span style=\"{{dish.photo}}\">\n<img src=\"{{dish.img}}\" alt=\"{{dish.name}}\" style=\"position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover\">\n<span style=\"{{dish.badge}}\">\n<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; text-align: left\">\n<span style=\"font-size: 17px; font-weight: 600; color: #1F2937\">{{dish.name}}</span>\n<span style=\"font-size: 14px; color: #64748B\">{{dish.parts}}</span>\n</span>\n</button>\n</sc-for>\n</div>\n<a href=\"#\" style=\"align-self: center; display: flex; align-items: center; gap: 6px; min-height: 44px; font-size: 15px; font-weight: 600; text-decoration: none\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5\"></path></svg>\nZwei andere zeigen\n</a>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<div style=\"font-size: 13px; color: #64748B; text-align: center\">Oder heute nicht kochen</div>\n<div style=\"display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px\">\n<button style=\"height: 48px; border-radius: 12px; border: 1.5px solid #E5E7EB; background: #FFFFFF; color: #1F2937; font: inherit; font-size: 14px; font-weight: 600\">Überspringen</button>\n<button style=\"height: 48px; border-radius: 12px; border: 1.5px solid #E5E7EB; background: #FFFFFF; color: #1F2937; font: inherit; font-size: 14px; font-weight: 600\">Aufwärmen</button>\n<button style=\"height: 48px; border-radius: 12px; border: 1.5px solid #E5E7EB; background: #FFFFFF; color: #1F2937; font: inherit; font-size: 14px; font-weight: 600\">Auswärts</button>\n</div>\n</div>\n<a href=\"TagFertig.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Weiter zum Mittagessen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { picked: 'oats' };
}
renderVals() {
const list = [
{ id: 'oats', name: 'Haferbrei mit Beeren', parts: 'Haferflocken · Beeren · Banane', tint: '#F6E7CF', img: '../assets/oats.webp' },
{ id: 'toast', name: 'Ei-Toast mit Hähnchenschinken', parts: 'Eier · Brot · Hähnchenschinken', tint: '#EFE6D6', img: '../assets/hamtoast.webp' }
];
const picked = this.state.picked;
return {
dishes: list.map(d => {
const on = picked === d.id;
return {
name: d.name,
parts: d.parts,
img: d.img,
pick: () => this.setState({ picked: d.id }),
style: 'display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: 20px; cursor: pointer; font: inherit; background: #FFFFFF; ' + (on ? 'border: 2.5px solid #0F6B3F' : 'border: 1.5px solid #E5E7EB; opacity: 0.75'),
photo: 'position: relative; display: flex; align-items: center; justify-content: center; height: 124px; overflow: hidden; background: ' + d.tint,
badge: 'position: absolute; top: 10px; right: 10px; display: ' + (on ? 'flex' : 'none') + '; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 999px; background: #0F6B3F'
};
})
};
}
}
return Component; } };
SCREENS["TagFertig"] = { label: "Tag fertig", title: "Tag fertig", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 20px 32px; display: flex; flex-direction: column; gap: 18px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; align-items: center; gap: 14px; padding: 0 4px\">\n<span style=\"display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F\">\n<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12l5 5 9-10\"></path></svg>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 2px\">\n<span style=\"font-size: 24px; line-height: 30px; font-weight: 700\">{{headline}}</span>\n<span style=\"font-size: 15px; color: #64748B\">{{remaining}}</span>\n</span>\n</div>\n<div style=\"display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px\">\n<sc-for list=\"{{week}}\" as=\"d\" hint-placeholder-count=\"7\">\n<span style=\"{{d.style}}\">\n<span style=\"font-size: 12px; font-weight: 600\">{{d.short}}</span>\n<span style=\"font-size: 17px; font-weight: 700\">{{d.date}}</span>\n<span style=\"{{d.mark}}\"></span>\n</span>\n</sc-for>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 16px; background: #FFFFFF; border: 1.5px solid #0F6B3F\">\n<span style=\"font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #0F6B3F\">MONTAG</span>\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 15px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #0F6B3F\"></span>Haferbrei mit Beeren</span>\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 15px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #F2B866\"></span>Pasta · aufwärmen</span>\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 15px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box\"></span>Auswärts essen</span>\n</div>\n<sc-if value=\"{{copied}}\" hint-placeholder-val=\"{{ false }}\">\n<div style=\"display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 16px; background: #EEF5F0\">\n<span style=\"font-size: 15px; font-weight: 600\">Dienstag übernommen</span>\n<span style=\"font-size: 14px; line-height: 20px; color: #64748B\">Gleiche Gerichte und Modi wie Montag. Einzelne Mahlzeiten tauschst du im Kalender mit einem Tipp.</span>\n<button onClick=\"{{undo}}\" style=\"align-self: flex-start; min-height: 44px; padding: 0; border: none; background: none; color: #0F6B3F; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer\">Rückgängig</button>\n</div>\n</sc-if>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<a href=\"Tag.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">{{nextLabel}}</a>\n<sc-if value=\"{{canCopy}}\" hint-placeholder-val=\"{{ true }}\">\n<button onClick=\"{{copy}}\" style=\"display: flex; align-items: center; justify-content: center; gap: 8px; height: 52px; border-radius: 999px; border: 1.5px solid #0F6B3F; background: #FFFFFF; color: #0F6B3F; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"></rect><path d=\"M5 15V6a2 2 0 0 1 2-2h9\"></path></svg>\nDienstag wie Montag\n</button>\n</sc-if>\n<a href=\"Wochenplan.dc.html\" style=\"display: flex; align-items: center; justify-content: center; min-height: 44px; font-size: 15px; font-weight: 600; text-decoration: none\">Später weitermachen</a>\n</div>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { copied: false };
}
renderVals() {
const copied = this.state.copied;
const names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const done = copied ? [0, 1] : [0];
const chosen = [0, 1, 2, 3];
const week = names.map((n, i) => {
const isDone = done.includes(i);
const isChosen = chosen.includes(i);
const base = 'display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-radius: 12px; ';
const style = isDone ? base + 'background: #0F6B3F; color: #FFFFFF' : isChosen ? base + 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #0F6B3F' : base + 'background: #FFF8F0; color: #9CA3AF; border: 1px solid #E5E7EB';
const mark = 'width: 6px; height: 6px; border-radius: 999px; background: ' + (isDone ? '#FFFFFF' : isChosen ? '#F2B866' : 'transparent');
return { short: n, date: String(5 + i), style, mark };
});
const open = chosen.filter(i => !done.includes(i)).map(i => names[i]);
return {
week,
copied,
canCopy: !copied,
headline: copied ? 'Mo und Di stehen' : 'Montag ist geplant',
remaining: 'Nur noch ' + open.join(' und ').replace(/ und (?=.* und )/g, ', '),
nextLabel: 'Weiter mit ' + (copied ? 'Mittwoch' : 'Dienstag'),
copy: () => this.setState({ copied: true }),
undo: () => this.setState({ copied: false })
};
}
}
return Component; } };
SCREENS["Wochenplan"] = { label: "Kalender", title: "Wochenkalender", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 56px 20px 32px; display: flex; flex-direction: column; gap: 16px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 6px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">KW 41</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 36px; font-weight: 700\">Deine Woche</h1>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px\">\n<sc-for list=\"{{days}}\" as=\"day\" hint-placeholder-count=\"4\">\n<a href=\"Tag.dc.html\" style=\"display: flex; gap: 14px; padding: 12px 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; text-decoration: none; color: #1F2937\">\n<span style=\"display: flex; flex-direction: column; align-items: center; width: 36px; flex-shrink: 0\">\n<span style=\"font-size: 13px; font-weight: 600; color: #64748B\">{{day.short}}</span>\n<span style=\"font-size: 22px; font-weight: 700\">{{day.date}}</span>\n</span>\n<span style=\"display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0\">\n<sc-for list=\"{{day.meals}}\" as=\"m\" hint-placeholder-count=\"3\">\n<span style=\"display: flex; align-items: center; gap: 8px; font-size: 14px; line-height: 18px\">\n<span style=\"width: 52px; flex-shrink: 0; font-size: 12px; color: #64748B\">{{m.slot}}</span>\n<span style=\"{{m.dot}}\"></span>\n<span style=\"{{m.textStyle}}\">{{m.text}}</span>\n</span>\n</sc-for>\n</span>\n</a>\n</sc-for>\n</div>\n<div style=\"display: flex; gap: 8px\">\n<sc-for list=\"{{free}}\" as=\"f\" hint-placeholder-count=\"3\">\n<a href=\"Woche.dc.html\" style=\"flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 56px; border-radius: 14px; border: 1.5px dashed #CBD5CF; color: #64748B; text-decoration: none\">\n<span style=\"font-size: 13px; font-weight: 600\">{{f.short}} {{f.date}}</span>\n<span style=\"font-size: 12px\">+ planen</span>\n</a>\n</sc-for>\n</div>\n<div style=\"display: flex; gap: 14px; justify-content: center; font-size: 12px; color: #64748B\">\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #0F6B3F\"></span>kochen</span>\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; background: #F2B866\"></span>aufwärmen</span>\n<span style=\"display: flex; align-items: center; gap: 5px\"><span style=\"width: 8px; height: 8px; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box\"></span>auswärts</span>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<a href=\"Korb.dc.html\" style=\"display: flex; align-items: center; justify-content: center; height: 56px; border-radius: 999px; background: #0F6B3F; color: #FFFFFF; font-size: 17px; font-weight: 600; text-decoration: none\">Einkaufskorb erstellen</a>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
renderVals() {
const dot = {
cook: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #0F6B3F',
heat: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #F2B866',
out: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; border: 1.5px solid #64748B; box-sizing: border-box',
open: 'width: 8px; height: 8px; flex-shrink: 0; border-radius: 999px; background: #E5E7EB'
};
const m = (slot, kind, text) => ({ slot, text, dot: dot[kind], textStyle: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ' + (kind === 'open' ? 'color: #64748B; font-style: italic' : '') });
return {
days: [
{ short: 'Mo', date: '5', meals: [m('Frühstück', 'cook', 'Haferbrei mit Beeren'), m('Mittag', 'heat', 'Pasta · aufwärmen'), m('Abend', 'out', 'Auswärts essen')] },
{ short: 'Di', date: '6', meals: [m('Frühstück', 'cook', 'Joghurt-Obst-Frühstück'), m('Mittag', 'cook', 'Hähnchen-Kartoffel-Bowl'), m('Abend', 'cook', 'Lachs-Reis-Bowl')] },
{ short: 'Mi', date: '7', meals: [m('Frühstück', 'cook', 'Rührei mit Gemüse'), m('Mittag', 'open', 'noch offen'), m('Abend', 'cook', 'Linsen-Curry-Bowl')] },
{ short: 'Do', date: '8', meals: [m('Frühstück', 'open', 'noch offen'), m('Mittag', 'open', 'noch offen'), m('Abend', 'open', 'noch offen')] }
],
free: [{ short: 'Fr', date: '9' }, { short: 'Sa', date: '10' }, { short: 'So', date: '11' }]
};
}
}
return Component; } };
SCREENS["Korb"] = { label: "Einkauf", title: "Einkaufskorb", html: "<div style=\"width: 390px; height: 844px; box-sizing: border-box; padding: 48px 20px 28px; display: flex; flex-direction: column; gap: 12px; background: #FFF8F0; color: #1F2937; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif\">\n<div style=\"display: flex; flex-direction: column; gap: 4px; padding: 0 4px\">\n<div style=\"font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #0F6B3F\">MO 5. – DO 8. OKTOBER</div>\n<h1 style=\"margin: 0; font-size: 28px; line-height: 34px; font-weight: 700\">Dein Einkauf</h1>\n<p style=\"margin: 0; font-size: 14px; line-height: 20px; color: #64748B\">6 Gerichte zum Kochen · 1 zum Aufwärmen · Backen</p>\n</div>\n<div style=\"display: flex; flex-direction: column; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB; overflow: hidden\">\n<sc-for list=\"{{items}}\" as=\"item\" hint-placeholder-count=\"4\">\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; padding: 4px 14px; box-sizing: border-box; border-bottom: 1px solid #F1F1EE\">\n<span style=\"display: flex; flex-direction: column; gap: 1px; min-width: 0\">\n<span style=\"font-size: 15px; font-weight: 600\">{{item.name}}</span>\n<span style=\"font-size: 12px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap\">für {{item.for}}</span>\n</span>\n<span style=\"font-size: 13px; color: #64748B; flex-shrink: 0\">{{item.qty}}</span>\n</div>\n</sc-for>\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 46px; padding: 4px 14px; box-sizing: border-box; background: #EEF5F0; border-bottom: 1px solid #F1F1EE\">\n<span style=\"display: flex; flex-direction: column; gap: 1px; min-width: 0\">\n<span style=\"font-size: 15px; font-weight: 600\">Kuchen backen</span>\n<span style=\"font-size: 12px; color: #64748B\">Mehl · Zucker · Butter · Eier</span>\n</span>\n<span style=\"font-size: 13px; color: #64748B; flex-shrink: 0\">4 Zutaten</span>\n</div>\n<button style=\"min-height: 44px; border: none; background: #FFFFFF; color: #0F6B3F; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer\">5 weitere Zutaten anzeigen</button>\n</div>\n<div style=\"display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"width: 10px; height: 10px; border-radius: 999px; background: #F2B866; flex-shrink: 0\"></span>\n<span style=\"font-size: 14px; line-height: 20px\">Fertiggericht Pasta · Mo Mittag</span>\n</div>\n<div style=\"display: flex; flex-direction: column; gap: 10px; padding: 14px; border-radius: 16px; background: #FFFFFF; border: 1px solid #E5E7EB\">\n<span style=\"font-size: 17px; font-weight: 600\">Noch etwas dazu?</span>\n<span style=\"font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #64748B\">IMMER DABEI</span>\n<div style=\"display: flex; flex-wrap: wrap; gap: 8px\">\n<sc-for list=\"{{regulars}}\" as=\"r\" hint-placeholder-count=\"5\">\n<button onClick=\"{{r.toggle}}\" style=\"{{r.style}}\">{{r.label}}</button>\n</sc-for>\n</div>\n<label for=\"search\" style=\"position: absolute; width: 1px; height: 1px; overflow: hidden\">Produkt suchen</label>\n<div style=\"display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 14px; border-radius: 12px; background: #FFF8F0; border: 1.5px solid #E5E7EB\">\n<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"M20 20l-3.5-3.5\"></path></svg>\n<input id=\"search\" type=\"text\" placeholder=\"Produkt hinzufügen, z. B. Kaffee\" style=\"flex: 1; min-width: 0; border: none; outline: none; background: none; font: inherit; font-size: 15px; color: #1F2937\">\n</div>\n</div>\n<div style=\"flex-grow: 1\"></div>\n<div style=\"display: flex; align-items: center; justify-content: space-between; gap: 16px\">\n<span style=\"display: flex; flex-direction: column\">\n<span style=\"font-size: 13px; color: #64748B\">Im Korb · {{extraCount}}</span>\n<span style=\"font-size: 20px; font-weight: 700\">{{total}} Artikel</span>\n</span>\n<button style=\"height: 56px; padding: 0 28px; border-radius: 999px; border: none; background: #0F6B3F; color: #FFFFFF; font: inherit; font-size: 17px; font-weight: 600; cursor: pointer\">Korb speichern</button>\n</div>\n</div>", make: function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { on: { juice: true, milk: true } };
}
renderVals() {
const on = this.state.on;
const defs = [
{ id: 'juice', label: 'Apfelsaft' },
{ id: 'milk', label: 'Milch' },
{ id: 'coffee', label: 'Kaffee' },
{ id: 'bread', label: 'Brot' },
{ id: 'cheese', label: 'Käse' }
];
const n = defs.filter(d => on[d.id]).length;
return {
extraCount: n === 0 ? 'ohne Extras' : n + (n === 1 ? ' Extra' : ' Extras'),
total: 14 + n,
items: [
{ name: 'Haferflocken', for: 'Haferbrei · Mo', qty: '500 g' },
{ name: 'Beeren', for: 'Haferbrei · Mo, Joghurt-Obst · Di', qty: '2 × 250 g' },
{ name: 'Hähnchenbrust', for: 'Hähnchen-Kartoffel-Bowl · Di', qty: '400 g' },
{ name: 'Lachs', for: 'Lachs-Reis-Bowl · Di', qty: '250 g' }
],
regulars: defs.map(d => {
const active = !!on[d.id];
return {
label: (active ? '✓ ' : '+ ') + d.label,
toggle: () => this.setState({ on: Object.assign({}, on, { [d.id]: !active }) }),
style: 'min-height: 40px; padding: 0 14px; border-radius: 999px; font: inherit; font-size: 14px; cursor: pointer; ' + (active ? 'background: #0F6B3F; color: #FFFFFF; border: 1.5px solid #0F6B3F; font-weight: 600' : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB')
};
})
};
}
}
return Component; } };
window.SB_APP_SCREENS = SCREENS; window.SB_APP_ORDER = ["Haushalt", "Main", "Woche", "Tag", "Wischen", "TagFertig", "Wochenplan", "Korb"];
})();
