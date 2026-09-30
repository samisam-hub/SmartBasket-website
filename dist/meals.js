// Gemeinsamer Datenbestand des Planungs-Konfigurators für beide Sprachfassungen.
// Shared data for the planning demo, used by both language versions.
//
// Mengen sind pro Person und Tag. Packungsgröße und Preis gehören zur Zutat,
// nicht zum Gericht, damit dieselbe Zutat überall gleich kalkuliert wird.
// Amounts are per person and per day. Pack size and price belong to the
// ingredient, so the same ingredient is always priced the same way.

// Auswahlwerte fuer das Kalorienziel. 1500 ist die Vorgabe.
const SB_CAL_STEPS = [1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500];

const SB_INGREDIENTS = {
  bread:     { en: 'Sourdough bread',            de: 'Sauerteigbrot',           size: 500,  price: 2.8 },
  eggs:      { en: 'Eggs (edible mass)',         de: 'Eier (essbarer Anteil)',  size: 300,  price: 2.4 },
  tomatoes:  { en: 'Cherry tomatoes',            de: 'Kirschtomaten',           size: 250,  price: 1.8 },
  spinach:   { en: 'Spinach',                    de: 'Spinat',                  size: 200,  price: 1.5 },
  oil:       { en: 'Olive oil',                  de: 'Olivenöl',                size: 450,  price: 5.5 },
  parsley:   { en: 'Parsley',                    de: 'Petersilie',              size: 30,   price: 0.9 },
  pepper:    { en: 'Black pepper',               de: 'Schwarzer Pfeffer',       size: 50,   price: 1.2 },
  beef:      { en: 'Beef steak (raw)',           de: 'Rindersteak (roh)',       size: 300,  price: 6 },
  potatoes:  { en: 'Potatoes',                   de: 'Kartoffeln',              size: 1000, price: 2 },
  chicken:   { en: 'Chicken breast (raw)',       de: 'Hähnchenbrust (roh)',     size: 600,  price: 5.4 },
  noodles:   { en: 'Noodles (dry)',              de: 'Nudeln (trocken)',        size: 500,  price: 1.4 },
  mushrooms: { en: 'Button mushrooms',           de: 'Champignons',             size: 250,  price: 1.8 },
  onion:     { en: 'Onion',                      de: 'Zwiebel',                 size: 500,  price: 1 },
  cream:     { en: 'Soy cooking cream',          de: 'Soja-Kochcreme',          size: 200,  price: 1.5, unit: 'ml' },
  salmon:    { en: 'Salmon fillet (raw)',        de: 'Lachsfilet (roh)',        size: 300,  price: 5.9 },
  tofu:      { en: 'Plain tofu',                 de: 'Naturtofu',               size: 400,  price: 2.5 },
  broccoli:  { en: 'Broccoli',                   de: 'Brokkoli',                size: 500,  price: 1.9 },
  carrots:   { en: 'Carrots',                    de: 'Karotten',                size: 1000, price: 1.5 },
  teriyaki:  { en: 'Teriyaki marinade',          de: 'Teriyaki-Marinade',       size: 250,  price: 2.5, unit: 'ml' },
  oats:      { en: 'Rolled oats',                de: 'Haferflocken',            size: 500,  price: 1.4 },
  banana:    { en: 'Banana',                     de: 'Banane',                  size: 600,  price: 1.5 },
  berries:   { en: 'Berries',                    de: 'Beeren',                  size: 250,  price: 2.2 },
  lasagne:   { en: 'Lasagne (chilled ready meal)', de: 'Lasagne (Kühlregal)',   size: 1,    price: 3.9,
               unit: { en: 'serving', de: 'Portion' } }
};

// slot: welche Mahlzeit. name: Überschrift. option: Beschriftung des Auswahlknopfs.
// Reihenfolge der Zutaten bleibt erhalten, die Vorratsfunktion greift auf die erste zu.
const SB_MEALS = {
  eggs: {
    slot: 'meal', image: 'breakfast.webp', kcal: 389, protein: 21,
    name:   { en: 'Sunny-side-up sourdough', de: 'Spiegelei auf Sauerteigbrot' },
    option: { en: ['Eggs on sourdough', 'Savoury & satisfying'],
              de: ['Spiegelei auf Brot', 'Herzhaft und sättigend'] },
    items: [['bread', 70], ['eggs', 100], ['tomatoes', 100], ['spinach', 30], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  oats: {
    slot: 'meal', image: 'oats.webp', kcal: 453, protein: 13,
    name:   { en: 'Overnight oats with banana', de: 'Overnight Oats mit Banane' },
    option: { en: ['Banana overnight oats', 'Simple & plant-based'],
              de: ['Overnight Oats mit Banane', 'Einfach und pflanzlich'] },
    items: [['oats', 80], ['banana', 120], ['berries', 100]]
  },
  steak: {
    slot: 'lunch', image: 'steak.webp', kcal: 569, protein: 43,
    name:   { en: 'Steak with potatoes and spinach', de: 'Steak mit Kartoffeln und Spinat' },
    option: { en: ['Steak with potatoes', 'Spinach & fresh herbs'],
              de: ['Steak mit Kartoffeln', 'Spinat und frische Kräuter'] },
    items: [['beef', 160], ['potatoes', 220], ['spinach', 100], ['oil', 8], ['parsley', 3], ['pepper', 0.2]]
  },
  stroganoff: {
    slot: 'lunch', image: 'stroganoff.webp', kcal: 632, protein: 54,
    name:   { en: 'Chicken Stroganoff with noodles', de: 'Hähnchen-Stroganoff mit Nudeln' },
    option: { en: ['Chicken Stroganoff', 'Noodles & creamy mushroom sauce'],
              de: ['Hähnchen-Stroganoff', 'Nudeln und cremige Pilzsauce'] },
    items: [['chicken', 180], ['noodles', 65], ['mushrooms', 100], ['onion', 40], ['cream', 70], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  lheat: {
    slot: 'lunch', icon: 'heat', kcal: 620, protein: 26,
    name:   { en: 'Lasagne to heat', de: 'Lasagne zum Erhitzen' },
    option: { en: ['Lasagne to heat', 'Chilled ready meal, no cooking'],
              de: ['Lasagne erhitzen', 'Fertiggericht, kein Kochen'] },
    items: [['lasagne', 1]]
  },
  salmon: {
    slot: 'dinner', image: 'salmon.webp', kcal: 608, protein: 40,
    name:   { en: 'Salmon with potatoes and spinach', de: 'Lachs mit Kartoffeln und Spinat' },
    option: { en: ['Salmon with potatoes', 'Spinach & fresh herbs'],
              de: ['Lachs mit Kartoffeln', 'Spinat und frische Kräuter'] },
    items: [['salmon', 150], ['potatoes', 280], ['spinach', 150], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  teriyaki: {
    slot: 'dinner', image: 'teriyaki.webp', kcal: 686, protein: 47,
    name:   { en: 'Tofu teriyaki noodles', de: 'Teriyaki-Nudeln mit Tofu' },
    option: { en: ['Tofu teriyaki noodles', 'Broccoli, carrots & teriyaki sauce'],
              de: ['Teriyaki-Nudeln mit Tofu', 'Brokkoli, Karotten und Teriyaki-Sauce'] },
    items: [['tofu', 200], ['noodles', 70], ['broccoli', 150], ['carrots', 100], ['oil', 5], ['teriyaki', 15], ['parsley', 3], ['pepper', 0.2]]
  },
  dout: {
    slot: 'dinner', icon: 'out', est: true, kcal: 850, protein: 38,
    name:   { en: 'Dinner out', de: 'Abendessen auswärts' },
    option: { en: ['Eating out', 'Not part of the basket'],
              de: ['Auswärts essen', 'Nicht im Einkauf'] },
    items: []
  }
};

// Baut die Gerichte für eine Sprache in genau der Form, die demo.js und voice.js erwarten.
function sbBuildMeals(lang) {
  const out = {};
  for (const id in SB_MEALS) {
    const m = SB_MEALS[id];
    out[id] = {
      name: m.name[lang],
      kcal: m.kcal,
      protein: m.protein,
      items: m.items.map(function (entry) {
        const g = SB_INGREDIENTS[entry[0]];
        const unit = g.unit ? (typeof g.unit === 'string' ? g.unit : g.unit[lang]) : 'g';
        return [g[lang], entry[1], g.size, g.price, unit];
      })
    };
    if (m.image) out[id].image = m.image; else out[id].icon = m.icon;
    if (m.est) out[id].est = true;
  }
  return out;
}

// Beschriftungen der Auswahlknöpfe einer Mahlzeit, in der Reihenfolge oben.
function sbOptions(slot, lang) {
  const list = [];
  for (const id in SB_MEALS) {
    if (SB_MEALS[id].slot === slot) list.push([id].concat(SB_MEALS[id].option[lang]));
  }
  return list;
}

// Sucht die Kombination, die den Tageszielen am nächsten kommt.
// Reine Rechnerei über alle Kombinationen: bei acht Gerichten sind das 18 Stück.
// Kalorien zählen doppelt so stark wie fehlendes Protein, zu viel Protein wird nicht bestraft.
function sbBestPlan(state, meals) {
  const target = state.calorieTarget;
  const proteinTarget = state.proteinTarget;
  if (!target || target <= 0) return null;
  const byslot = function (slot) {
    return Object.keys(meals).filter(function (id) { return SB_MEALS[id].slot === slot; });
  };
  let best = null;
  byslot('meal').forEach(function (b) {
    byslot('lunch').forEach(function (l) {
      byslot('dinner').forEach(function (d) {
        const kcal = meals[b].kcal + meals[l].kcal + meals[d].kcal;
        const protein = meals[b].protein + meals[l].protein + meals[d].protein;
        let score = Math.abs(kcal - target) / target;
        if (proteinTarget && proteinTarget > 0 && protein < proteinTarget) {
          score += 0.5 * (proteinTarget - protein) / proteinTarget;
        }
        if (!best || score < best.score) best = { score: score, meal: b, lunch: l, dinner: d, kcal: kcal, protein: protein };
      });
    });
  });
  return best;
}
