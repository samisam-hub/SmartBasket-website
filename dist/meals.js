// Gemeinsamer Datenbestand des Planungs-Konfigurators für beide Sprachfassungen.
// Shared data for the planning demo, used by both language versions.
//
// Gerichte, Mengen und Nährwerte stammen aus dem Katalog der SmartBasket-App
// (data/meals.ts). Nährwerte werden hier genauso aus den Zutaten gerechnet wie dort,
// damit Demo und App dieselben Zahlen zeigen.
// Meals, amounts and nutrition come from the SmartBasket app catalogue (data/meals.ts).
// Nutrition is derived from the ingredients exactly as it is in the app.

// Auswahlwerte für das Kalorienziel. 1500 ist die Vorgabe.
// Die Spanne ist die, die der App-Katalog mit seinen Portionsspielräumen wirklich trifft.
const SB_CAL_STEPS = [1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100];

// Portionsspielraum je Zutatengruppe, in Prozent. Aus services/meals/config.ts der App.
// 'precise' heißt: die Menge steht fest (Eier, Gewürze, Fertigsauce).
const SB_TOL = { protein: 0.10, vegetables: 0.15, fruit: 0.15, staples: 0.10, oil: 0.02, precise: 0 };

// cal/prot: je 100 g bzw. 100 ml, aus dem Zutatenverzeichnis der App.
// size/price: Packungsgröße und Preis gehören zur Zutat, damit dieselbe Zutat
// überall gleich kalkuliert wird.
const SB_INGREDIENTS = {
  sourdough: { en: 'Sourdough bread',         de: 'Sauerteigbrot',          group: 'staples',    cal: 250, prot: 9,   size: 500,  price: 2.8 },
  bread:     { en: 'Wholemeal bread',         de: 'Vollkornbrot',           group: 'staples',    cal: 240, prot: 10,  size: 500,  price: 2.2 },
  eggs:      { en: 'Eggs (edible mass)',      de: 'Eier (essbarer Anteil)', group: 'precise',    cal: 143, prot: 13,  size: 300,  price: 2.4 },
  ham:       { en: 'Chicken ham',             de: 'Hähnchenschinken',       group: 'protein',    cal: 110, prot: 20,  size: 200,  price: 2.2 },
  yogurt:    { en: 'Greek yogurt',            de: 'Griechischer Joghurt',   group: 'protein',    cal: 73,  prot: 10,  size: 500,  price: 1.9 },
  cherry:    { en: 'Cherry tomatoes',         de: 'Kirschtomaten',          group: 'vegetables', cal: 18,  prot: 0.9, size: 250,  price: 1.8 },
  tomatoes:  { en: 'Chopped tomatoes',        de: 'Gehackte Tomaten',       group: 'vegetables', cal: 22,  prot: 1,   size: 400,  price: 0.9 },
  spinach:   { en: 'Spinach',                 de: 'Spinat',                 group: 'vegetables', cal: 23,  prot: 3,   size: 200,  price: 1.5 },
  broccoli:  { en: 'Broccoli',                de: 'Brokkoli',               group: 'vegetables', cal: 34,  prot: 3,   size: 500,  price: 1.9 },
  carrots:   { en: 'Carrots',                 de: 'Karotten',               group: 'vegetables', cal: 41,  prot: 1,   size: 1000, price: 1.5 },
  mushrooms: { en: 'Button mushrooms',        de: 'Champignons',            group: 'vegetables', cal: 22,  prot: 3,   size: 250,  price: 1.8 },
  onion:     { en: 'Onion',                   de: 'Zwiebel',                group: 'vegetables', cal: 40,  prot: 1,   size: 500,  price: 1 },
  potatoes:  { en: 'Potatoes',                de: 'Kartoffeln',             group: 'staples',    cal: 77,  prot: 2,   size: 1000, price: 2 },
  rice:      { en: 'Rice (dry)',              de: 'Reis (trocken)',         group: 'staples',    cal: 360, prot: 7,   size: 1000, price: 2.4 },
  pasta:     { en: 'Pasta (dry)',             de: 'Nudeln (trocken)',       group: 'staples',    cal: 350, prot: 12,  size: 500,  price: 1.4 },
  oats:      { en: 'Rolled oats (dry)',       de: 'Haferflocken',           group: 'staples',    cal: 370, prot: 13,  size: 500,  price: 1.4 },
  lentils:   { en: 'Lentils (dry)',           de: 'Linsen (trocken)',       group: 'protein',    cal: 350, prot: 25,  size: 500,  price: 2.2 },
  tofu:      { en: 'Plain tofu',              de: 'Naturtofu',              group: 'protein',    cal: 144, prot: 16,  size: 400,  price: 2.5 },
  chicken:   { en: 'Chicken breast (raw)',    de: 'Hähnchenbrust (roh)',    group: 'protein',    cal: 120, prot: 23,  size: 600,  price: 5.4 },
  beef:      { en: 'Beef steak (raw)',        de: 'Rindersteak (roh)',      group: 'protein',    cal: 190, prot: 22,  size: 300,  price: 6 },
  salmon:    { en: 'Salmon fillet (raw)',     de: 'Lachsfilet (roh)',       group: 'protein',    cal: 208, prot: 20,  size: 300,  price: 5.9 },
  tuna:      { en: 'Tuna in water (drained)', de: 'Thunfisch (abgetropft)', group: 'protein',    cal: 116, prot: 26,  size: 150,  price: 1.6 },
  banana:    { en: 'Banana',                  de: 'Banane',                 group: 'fruit',      cal: 89,  prot: 1,   size: 600,  price: 1.5 },
  berries:   { en: 'Berries',                 de: 'Beeren',                 group: 'fruit',      cal: 50,  prot: 1,   size: 250,  price: 2.2 },
  apple:     { en: 'Apple',                   de: 'Apfel',                  group: 'fruit',      cal: 52,  prot: 0.3, size: 750,  price: 2 },
  oil:       { en: 'Olive oil',               de: 'Olivenöl',               group: 'oil',        cal: 884, prot: 0,   size: 450,  price: 5.5 },
  cream:     { en: 'Soy cooking cream',       de: 'Soja-Kochcreme',         group: 'precise',    cal: 150, prot: 2,   size: 200,  price: 1.5, unit: 'ml' },
  teriyaki:  { en: 'Teriyaki marinade',       de: 'Teriyaki-Marinade',      group: 'precise',    cal: 100, prot: 6,   size: 250,  price: 2.5, unit: 'ml' },
  chocolate: { en: 'Dark chocolate',          de: 'Zartbitterschokolade',   group: 'precise',    cal: 600, prot: 7,   size: 100,  price: 1.9 },
  parsley:   { en: 'Parsley',                 de: 'Petersilie',             group: 'precise',    cal: 36,  prot: 3,   size: 30,   price: 0.9 },
  pepper:    { en: 'Black pepper',            de: 'Schwarzer Pfeffer',      group: 'precise',    cal: 251, prot: 10,  size: 50,   price: 1.2 },
  lasagne:   { en: 'Lasagne (chilled ready meal)', de: 'Lasagne (Kühlregal)', group: 'precise',  cal: 0,   prot: 0,   size: 1,    price: 3.9,
               unit: { en: 'serving', de: 'Portion' } }
};

// slot: welche Mahlzeit. name: Überschrift. option: Beschriftung des Auswahlknopfs.
// Je Mahlzeit von leicht nach herzhaft sortiert.
// kcal/protein werden aus items gerechnet; nur wo es keine Zutatenliste gibt
// (Fertiggericht, auswärts essen), stehen sie als Schätzwert direkt am Gericht.
const SB_MEALS = {
  // ---------- Frühstück / breakfast ----------
  hamtoast: {
    slot: 'meal', image: 'hamtoast.webp',
    name:   { en: 'Egg and chicken-ham toast', de: 'Toast mit Ei und Hähnchenschinken' },
    option: { en: ['Egg and ham toast', 'Light, still high in protein'],
              de: ['Toast mit Ei und Schinken', 'Leicht, trotzdem proteinreich'] },
    items: [['eggs', 100], ['bread', 60], ['ham', 50], ['parsley', 3], ['pepper', 0.2]]
  },
  eggs: {
    slot: 'meal', image: 'breakfast.webp',
    name:   { en: 'Sunny-side-up sourdough', de: 'Spiegelei auf Sauerteigbrot' },
    option: { en: ['Eggs on sourdough', 'Savoury & satisfying'],
              de: ['Spiegelei auf Brot', 'Herzhaft und sättigend'] },
    items: [['eggs', 100], ['sourdough', 70], ['cherry', 100], ['spinach', 30], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  yogurtbowl: {
    slot: 'meal', image: 'yogurtbowl.webp',
    name:   { en: 'Yogurt fruit breakfast', de: 'Joghurt mit Obst' },
    option: { en: ['Yogurt with fruit', 'Cold & quick'],
              de: ['Joghurt mit Obst', 'Kalt und schnell'] },
    items: [['yogurt', 250], ['oats', 50], ['berries', 120]]
  },
  oats: {
    slot: 'meal', image: 'oats.webp',
    name:   { en: 'Overnight oats with banana', de: 'Overnight Oats mit Banane' },
    option: { en: ['Banana overnight oats', 'Simple & plant-based'],
              de: ['Overnight Oats mit Banane', 'Einfach und pflanzlich'] },
    items: [['oats', 80], ['banana', 120], ['berries', 100]]
  },
  scrambled: {
    slot: 'meal', image: 'scrambled.webp',
    name:   { en: 'Scrambled eggs with vegetables', de: 'Rührei mit Gemüse' },
    option: { en: ['Scrambled eggs', 'Warm, with potatoes & spinach'],
              de: ['Rührei mit Gemüse', 'Warm, mit Kartoffeln und Spinat'] },
    items: [['eggs', 180], ['spinach', 100], ['potatoes', 180], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  tofubreakfast: {
    slot: 'meal', image: 'tofubreakfast.webp',
    name:   { en: 'Tofu potato scramble', de: 'Tofu-Kartoffel-Pfanne' },
    option: { en: ['Tofu potato scramble', 'Plant-based & filling'],
              de: ['Tofu-Kartoffel-Pfanne', 'Pflanzlich und sättigend'] },
    items: [['tofu', 200], ['potatoes', 180], ['spinach', 100], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },

  // ---------- Mittagessen / lunch ----------
  lentilpasta: {
    slot: 'lunch', image: 'lentilpasta.webp',
    name:   { en: 'Lentil pasta bowl', de: 'Nudeln mit Linsen' },
    option: { en: ['Lentil pasta bowl', 'The lightest lunch here'],
              de: ['Nudeln mit Linsen', 'Das leichteste Mittagessen'] },
    items: [['lentils', 60], ['pasta', 65], ['tomatoes', 200], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  chickenlentils: {
    slot: 'lunch', image: 'chickenlentils.webp',
    name:   { en: 'Chicken lentil bowl', de: 'Hähnchen mit Linsen' },
    option: { en: ['Chicken lentil bowl', 'The most protein per calorie'],
              de: ['Hähnchen mit Linsen', 'Das meiste Protein je Kalorie'] },
    items: [['chicken', 150], ['lentils', 65], ['carrots', 150], ['oil', 8], ['parsley', 3], ['pepper', 0.2]]
  },
  tunapotato: {
    slot: 'lunch', image: 'tunapotato.webp',
    name:   { en: 'Tuna potato salad', de: 'Thunfisch-Kartoffelsalat' },
    option: { en: ['Tuna potato salad', 'Nothing to cook'],
              de: ['Thunfisch-Kartoffelsalat', 'Nichts zu kochen'] },
    items: [['tuna', 150], ['potatoes', 300], ['carrots', 150], ['oil', 10], ['parsley', 3], ['pepper', 0.2]]
  },
  chickenpotato: {
    slot: 'lunch', image: 'chickenpotato.webp',
    name:   { en: 'Chicken potato bowl', de: 'Hähnchen mit Kartoffeln' },
    option: { en: ['Chicken potato bowl', 'Broccoli & roast potatoes'],
              de: ['Hähnchen mit Kartoffeln', 'Brokkoli und Röstkartoffeln'] },
    items: [['chicken', 180], ['potatoes', 300], ['broccoli', 150], ['oil', 10], ['parsley', 3], ['pepper', 0.2]]
  },
  eggsrice: {
    slot: 'lunch', image: 'eggsrice.webp',
    name:   { en: 'Egg and vegetable rice', de: 'Reis mit Ei und Gemüse' },
    option: { en: ['Egg and vegetable rice', 'Cheap & quick'],
              de: ['Reis mit Ei und Gemüse', 'Günstig und schnell'] },
    items: [['eggs', 150], ['rice', 80], ['carrots', 150], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  lheat: {
    slot: 'lunch', image: 'heatandeat.webp', est: true, kcal: 620, protein: 26,
    name:   { en: 'Lasagne to heat', de: 'Lasagne zum Erhitzen' },
    option: { en: ['Lasagne to heat', 'Chilled ready meal, no cooking'],
              de: ['Lasagne erhitzen', 'Fertiggericht, kein Kochen'] },
    items: [['lasagne', 1]]
  },

  // ---------- Abendessen / dinner ----------
  steak: {
    slot: 'dinner', image: 'steak.webp',
    name:   { en: 'Steak with potatoes and spinach', de: 'Steak mit Kartoffeln und Spinat' },
    option: { en: ['Steak with potatoes', 'Spinach & fresh herbs'],
              de: ['Steak mit Kartoffeln', 'Spinat und frische Kräuter'] },
    items: [['beef', 160], ['potatoes', 220], ['spinach', 100], ['oil', 8], ['parsley', 3], ['pepper', 0.2]]
  },
  salmon: {
    slot: 'dinner', image: 'salmon.webp',
    name:   { en: 'Salmon with potatoes and spinach', de: 'Lachs mit Kartoffeln und Spinat' },
    option: { en: ['Salmon with potatoes', 'Spinach & fresh herbs'],
              de: ['Lachs mit Kartoffeln', 'Spinat und frische Kräuter'] },
    items: [['salmon', 150], ['potatoes', 280], ['spinach', 150], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  stroganoff: {
    slot: 'dinner', image: 'stroganoff.webp',
    name:   { en: 'Chicken Stroganoff with noodles', de: 'Hähnchen-Stroganoff mit Nudeln' },
    option: { en: ['Chicken Stroganoff', 'Noodles & creamy mushroom sauce'],
              de: ['Hähnchen-Stroganoff', 'Nudeln und cremige Pilzsauce'] },
    items: [['chicken', 180], ['pasta', 65], ['mushrooms', 100], ['onion', 40], ['cream', 70], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  teriyaki: {
    slot: 'dinner', image: 'teriyaki.webp',
    name:   { en: 'Tofu teriyaki noodles', de: 'Teriyaki-Nudeln mit Tofu' },
    option: { en: ['Tofu teriyaki noodles', 'Broccoli, carrots & teriyaki sauce'],
              de: ['Teriyaki-Nudeln mit Tofu', 'Brokkoli, Karotten und Teriyaki-Sauce'] },
    items: [['tofu', 200], ['pasta', 70], ['broccoli', 150], ['carrots', 100], ['oil', 5], ['teriyaki', 15], ['parsley', 3], ['pepper', 0.2]]
  },
  salmonrice: {
    slot: 'dinner', image: 'salmonrice.webp',
    name:   { en: 'Salmon rice bowl', de: 'Lachs mit Reis und Brokkoli' },
    option: { en: ['Salmon rice bowl', 'The heartiest evening here'],
              de: ['Lachs mit Reis und Brokkoli', 'Der herzhafteste Abend'] },
    items: [['salmon', 150], ['rice', 75], ['broccoli', 180], ['oil', 5], ['parsley', 3], ['pepper', 0.2]]
  },
  dout: {
    slot: 'dinner', image: 'eatout.webp', est: true, kcal: 850, protein: 38,
    name:   { en: 'Dinner out', de: 'Abendessen auswärts' },
    option: { en: ['Eating out', 'Not part of the basket'],
              de: ['Auswärts essen', 'Nicht im Einkauf'] },
    items: []
  },

  // ---------- Snack ----------
  // Der Snack ist die grobe Stellschraube, die Portionsspielräume sind die feine.
  nosnack: {
    slot: 'snack', icon: 'none', kcal: 0, protein: 0,
    name:   { en: 'No snack', de: 'Kein Snack' },
    option: { en: ['No snack', 'Leave it out'], de: ['Kein Snack', 'Weglassen'] },
    items: []
  },
  fruitchoc: {
    slot: 'snack', image: 'snack.webp',
    name:   { en: 'Banana and dark chocolate', de: 'Banane und dunkle Schokolade' },
    option: { en: ['Banana & dark chocolate', 'A little something'],
              de: ['Banane und dunkle Schokolade', 'Eine Kleinigkeit'] },
    items: [['banana', 60], ['chocolate', 10]]
  },
  applesnack: {
    slot: 'snack', image: 'applesnack.webp',
    name:   { en: 'Apple and berry snack', de: 'Apfel mit Beeren' },
    option: { en: ['Apple & berries', 'Fruit only'], de: ['Apfel mit Beeren', 'Nur Obst'] },
    items: [['apple', 150], ['berries', 80]]
  },
  yogurtsnack: {
    slot: 'snack', image: 'yogurtsnack.webp',
    name:   { en: 'Yogurt and berry snack', de: 'Joghurt mit Beeren' },
    option: { en: ['Yogurt & berries', 'Small, mostly protein'],
              de: ['Joghurt mit Beeren', 'Klein, vor allem Protein'] },
    items: [['yogurt', 150], ['berries', 60]]
  }
};

// Baut die Gerichte für eine Sprache in genau der Form, die demo.js und voice.js erwarten.
// base hält die unveränderte Portion, flex den Kalorien- und Proteinhub bei vollem
// Portionsausschlag. Beides braucht sbFit, um das Kalorienziel exakt zu treffen.
function sbBuildMeals(lang) {
  const out = {};
  for (const id in SB_MEALS) {
    const m = SB_MEALS[id];
    let kcal = 0, protein = 0, flexKcal = 0, flexProtein = 0;
    const items = m.items.map(function (entry) {
      const g = SB_INGREDIENTS[entry[0]], amount = entry[1], tol = SB_TOL[g.group];
      kcal += g.cal * amount / 100;
      protein += g.prot * amount / 100;
      flexKcal += g.cal * amount / 100 * tol;
      flexProtein += g.prot * amount / 100 * tol;
      const unit = g.unit ? (typeof g.unit === 'string' ? g.unit : g.unit[lang]) : 'g';
      return [g[lang], amount, g.size, g.price, unit, tol];
    });
    // Gerichte ohne Zutatenliste tragen ihren Schätzwert selbst und lassen sich nicht portionieren.
    if (typeof m.kcal === 'number') { kcal = m.kcal; protein = m.protein; flexKcal = 0; flexProtein = 0; }
    out[id] = {
      name: m.name[lang], kcal: Math.round(kcal), protein: Math.round(protein),
      items: items, base: { kcal: kcal, protein: protein, items: items },
      flex: { kcal: flexKcal, protein: flexProtein }
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

const SB_SLOTS = ['meal', 'lunch', 'dinner', 'snack'];

// Der Portionsregler: ein Wert zwischen -1 und +1 für den ganzen Tag. -1 heißt, jede
// Zutat liegt am unteren Rand ihrer Toleranz, +1 am oberen. So arbeitet auch die App,
// nur dass sie je Zutat entscheidet. Liegt das Ziel außerhalb, bleibt der Regler am Anschlag.
function sbDial(picked, target) {
  let base = 0, flex = 0;
  for (let i = 0; i < picked.length; i++) { base += picked[i].base.kcal; flex += picked[i].flex.kcal; }
  if (!target || target <= 0 || flex <= 0) return 0;
  return Math.max(-1, Math.min(1, (target - base) / flex));
}

// Schreibt den Reglerstand in alle Gerichte zurück: Mengen, Kalorien, Protein.
function sbApplyDial(meals, dial) {
  for (const id in meals) {
    const m = meals[id];
    m.kcal = Math.round(m.base.kcal + dial * m.flex.kcal);
    m.protein = Math.round(m.base.protein + dial * m.flex.protein);
    m.items = m.base.items.map(function (it) {
      // Angepasste Mengen auf ganze Gramm runden; feste Mengen (Gewürze) bleiben, wie sie sind.
      const amount = it[5] > 0 ? Math.round(it[1] * (1 + dial * it[5])) : it[1];
      return [it[0], amount, it[2], it[3], it[4], it[5]];
    });
  }
}

// Stellt die Portionen auf das Kalorienziel ein und sorgt dafür, dass die vier
// angezeigten Werte in der Summe genau das Ziel ergeben und nicht nur fast.
function sbFit(state, meals) {
  const picked = SB_SLOTS.map(function (s) { return meals[state[s]]; });
  for (let i = 0; i < picked.length; i++) if (!picked[i]) return 0;
  const dial = sbDial(picked, state.calorieTarget);
  sbApplyDial(meals, dial);
  const exactOf = function (m) { return m.base.kcal + dial * m.flex.kcal; };
  let exact = 0, shown = 0;
  for (let i = 0; i < picked.length; i++) { exact += exactOf(picked[i]); shown += picked[i].kcal; }
  let diff = Math.round(exact) - shown;
  // Größter Rest zuerst: die Rundungsdifferenz landet dort, wo sie am wenigsten auffällt.
  const order = picked.slice().sort(function (a, b) {
    const ra = exactOf(a) - Math.floor(exactOf(a)), rb = exactOf(b) - Math.floor(exactOf(b));
    return diff > 0 ? rb - ra : ra - rb;
  });
  for (let i = 0; diff !== 0 && i < order.length; i++) {
    if (order[i].flex.kcal <= 0) continue;          // Schätzwerte nicht verbiegen
    const step = diff > 0 ? 1 : -1;
    order[i].kcal += step;
    diff -= step;
  }
  return dial;
}

// Sucht die Kombination, die den Tageszielen am nächsten kommt, jeweils mit dem
// besten Portionsstand. Reine Rechnerei über alle Kombinationen: hier 576 Stück.
// Kalorien zählen doppelt so stark wie fehlendes Protein, zu viel Protein wird nicht bestraft.
// Treffen mehrere Kombinationen das Ziel genau, gewinnt die mit den normalsten Portionen:
// die Gerichtwahl soll das Grobe erledigen, der Portionsregler nur nachjustieren.
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
       byslot('snack').forEach(function (s) {
        const picked = [meals[b], meals[l], meals[d], meals[s]];
        const dial = sbDial(picked, target);
        let kcal = 0, protein = 0;
        for (let i = 0; i < picked.length; i++) {
          kcal += picked[i].base.kcal + dial * picked[i].flex.kcal;
          protein += picked[i].base.protein + dial * picked[i].flex.protein;
        }
        let score = Math.abs(kcal - target) / target + 0.2 * Math.abs(dial);
        if (proteinTarget && proteinTarget > 0 && protein < proteinTarget) {
          score += 0.5 * (proteinTarget - protein) / proteinTarget;
        }
        if (!best || score < best.score) {
          best = { score: score, meal: b, lunch: l, dinner: d, snack: s,
                   dial: dial, kcal: Math.round(kcal), protein: Math.round(protein) };
        }
       });
      });
    });
  });
  return best;
}
