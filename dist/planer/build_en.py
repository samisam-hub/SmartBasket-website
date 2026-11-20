"""Erzeugt planer-en.js und rezepte-en.json aus der deutschen Fassung."""
import json, re
D = '/home/claude/smartbasket-website/dist/planer/'
src = open(D + 'planer.js').read()

R = [  # (deutsch, englisch) – längste/spezifischste zuerst
 ("'sb-wochenplaner-v1'", "'sb-weekly-planner-v1'"),
 ("Kostenlos · ohne Anmeldung", "Free · no sign-up"),
 ("<h1>Meal Prep Wochenplan Vorlage</h1>", "<h1>Meal Prep Weekly Planner Template</h1>"),
 ("Stell dir deinen Wochenplan kostenlos zusammen: Suche Rezepte nach Zutaten, die du zu Hause hast, oder wisch dich durch Frühstück, Mittag- und Abendessen. Jedes Gericht landet automatisch in deiner Wochenplan-Vorlage – mit Einkaufsliste als PDF zum Herunterladen.",
  "Build your weekly meal plan for free: search recipes by the ingredients you have at home, or swipe through breakfast, lunch and dinner ideas. Every dish goes straight into your weekly planner template – with a shopping list as a downloadable PDF."),
 ("Für wen und wann?", "Who and when?"), ("Rezepte finden", "Find recipes"),
 ("Mit Zutaten suchen", "Search by ingredients"), ("Nach Kategorie wischen", "Swipe by category"),
 ("Deine Wochenplan-Vorlage", "Your weekly plan"),
 ("Wochenplan als PDF herunterladen", "Download weekly plan as PDF"),
 ("Leere Plätze automatisch füllen", "Fill empty slots automatically"), (">Plan leeren<", ">Clear plan<"),
 ("Noch einfacher in der App", "Even easier in the app"),
 ("SmartBasket plant die Woche für deinen Haushalt und rechnet die Einkaufsliste in ganze Packungen um.", "SmartBasket plans the week for your household and turns the shopping list into whole packs."),
 ("Kostenlos Beta testen ↗", "Try the free beta ↗"),
 ('<a href="/">Startseite</a><a href="/category/rezepte/">Rezepte</a>', '<a href="/">Home</a>'),
 ("'Wer isst mit?'", "'Who is eating?'"), ('Wer isst mit?', 'Who is eating?'),
 ('<span class="sp-cname">Erwachsene</span>', '<span class="sp-cname">Adults</span>'), ('<span class="sp-cname">Kinder</span>', '<span class="sp-cname">Children</span>'),
 ('aria-label="Weniger Erwachsene"', 'aria-label="Fewer adults"'), ('aria-label="Mehr Erwachsene"', 'aria-label="More adults"'),
 ('aria-label="Weniger Kinder"', 'aria-label="Fewer children"'), ('aria-label="Mehr Kinder"', 'aria-label="More children"'),
 ('Welche Tage?', 'Which days?'), ('Welche Mahlzeiten?', 'Which meals?'), ('>Ernährung<', '>Diet<'),
 ('Zutat oder Gericht', 'Ingredient or dish'), ('Zutat eingeben, z. B. Kartoffeln', 'Type an ingredient, e.g. potatoes'),
 ('>Hinzufügen<', '>Add<'), ("' entfernen\">'", "' remove\">'"), (' entfernen">', ' remove">'),
 ('Schnell hinzufügen:', 'Quick add:'), ('Alle Kategorien', 'All categories'),
 ("' Rezepte mit '", "' recipes with '"), ("' Rezepte'", "' recipes'"), ("' für „'", "' for \"'"), ("'“</p>'", "'\"</p>'"),
 ('Keine passenden Rezepte. Entferne eine Zutat oder einen Ernährungsfilter.', 'No matching recipes. Remove an ingredient or a diet filter.'),
 ('Weitere Rezepte anzeigen', 'Show more recipes'),
 ("' kcal pro Portion'", "' kcal per serving'"), ("' Min.'", "' min'"),
 ("'Aus dem Blog'", "'From the blog'"), ('>Aus dem Blog<', '>From the blog<'), ("' · aus dem Blog'", "' · from the blog'"),
 ("' weitere Zutat'", "' more ingredient'"), ("' weitere Zutaten'", "' more ingredients'"),
 ('Alles da (außer Basics)', 'You have everything (except basics)'),
 ('Keine Rezepte für diese Auswahl.', 'No recipes for this selection.'),
 ('aria-label="Überspringen"', 'aria-label="Skip"'), ('aria-label="Rezept ansehen"', 'aria-label="View recipe"'), ('aria-label="In den Wochenplan"', 'aria-label="Add to plan"'),
 ('Nach rechts wischen = in den Plan · nach links = überspringen · Pfeiltasten gehen auch', 'Swipe right = add to plan · left = skip · arrow keys work too'),
 ('<h3>Kategorie</h3><p>Wähle, wofür du gerade Gerichte suchst.</p>', '<h3>Category</h3><p>Choose which meal you are looking for.</p>'),
 ("'Noch <strong>'", "'<strong>'"), ("'</strong> freie '", "'</strong> free '"), ("'-Plätze in deiner Woche.'", "' slots left this week.'"),
 ("'Alle ' + slot(s).s + '-Plätze sind belegt.'", "'All ' + slot(s).s.toLowerCase() + ' slots are taken.'"),
 ("'Alle ' + slot(s).s + '-Plätze sind belegt. Entferne ein Gericht oder wähle mehr Tage.'", "'All ' + slot(s).s.toLowerCase() + ' slots are taken. Remove a dish or choose more days.'"),
 ('IN DEN PLAN', 'ADD TO PLAN'), ('NÄCHSTES', 'SKIP'),
 ('<span class="sp-free">frei</span>', '<span class="sp-free">free</span>'),
 ("' am ' + DAYS[d] + ' entfernen'", "' on ' + DAYS[d] + ': remove'"),
 ("' von ' + t + ' Plätzen geplant · für ' + who()", "' of ' + t + ' slots planned · for ' + who()"),
 ("'Plan geleert.'", "'Plan cleared.'"),
 ("' g Eiweiß pro Portion'", "' g protein per serving'"),
 ('aria-label="Schließen"', 'aria-label="Close"'), ("'<h3>Zutaten für '", "'<h3>Ingredients for '"), ("'<h3>Zubereitung</h3><p>'", "'<h3>Method</h3><p>'"),
 ('Zum ausführlichen Rezept im Blog →', 'Full recipe on the blog (German) →'),
 ("' Platz'", "' slot'"), ("' Plätze'", "' slots'"), ("' automatisch gefüllt.'", "' filled automatically.'"), ("'Dein Plan ist schon voll.'", "'Your plan is already full.'"),
 ("' erwachsene Person'", "' adult'"), ("' Erwachsene'", "' adults'"), ("' Kind'", "' child'"), ("' Kinder'", "' children'"), ("' und '", "' and '"), ("'1 Person'", "'1 person'"),
 ("'Mein Meal Prep Wochenplan'", "'My Meal Prep Weekly Plan'"), ("'Erstellt mit dem Wochenplaner auf meal-prep.tech'", "'Made with the weekly planner on meal-prep.tech'"),
 ("'Seite '", "'Page '"), ("'für ' + who()", "'for ' + who()"),
 ("'Woche vom ____________ bis ____________'", "'Week from ____________ to ____________'"), ("'Vorkochen am: ____________'", "'Prep day: ____________'"),
 ("'Notizen'", "'Notes'"), ("'Einkaufsliste'", "'Shopping list'"), ("'Mengen für ' + who() + ', über die Woche zusammengefasst.'", "'Amounts for ' + who() + ', combined for the week.'"),
 ("'Basics · '", "'Basics · '"), ("'Noch keine Gerichte im Plan.'", "'No dishes in your plan yet.'"),
 ("'Rezepte dieser Woche'", "'This week\\'s recipes'"), ("'Mengen pro Mahlzeit für ' + who() + '.'", "'Amounts per meal for ' + who() + '.'"),
 ("'Zubereitung', 64", "'Method', 64"), ("'Ausführliches Rezept auf meal-prep.tech'", "'Full recipe on meal-prep.tech'"),
 ("'PDF wird erstellt …'", "'Creating PDF …'"), ("'Fertig – dein Wochenplan wurde heruntergeladen.'", "'Done – your weekly plan has been downloaded.'"),
 ("'Das PDF konnte nicht erstellt werden. Bitte versuch es noch einmal.'", "'The PDF could not be created. Please try again.'"),
 ("save('meal-prep-wochenplan.pdf')", "save('meal-prep-weekly-plan.pdf')"),
 ("title: 'Mein Meal Prep Wochenplan'", "title: 'My Meal Prep Weekly Plan'"),
 # Konstanten
 ("{ id: 'f', l: 'Frühstück', s: 'Frühstück' }, { id: 'm', l: 'Mittagessen', s: 'Mittag' }", "{ id: 'f', l: 'Breakfast', s: 'Breakfast' }, { id: 'm', l: 'Lunch', s: 'Lunch' }"),
 ("{ id: 'a', l: 'Abendessen', s: 'Abend' }, { id: 's', l: 'Snack', s: 'Snack' }", "{ id: 'a', l: 'Dinner', s: 'Dinner' }, { id: 's', l: 'Snack', s: 'Snack' }"),
 ("['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']", "['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"),
 ("['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']", "['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"),
 ("l: 'Vegetarisch'", "l: 'Vegetarian'"), ("l: 'Glutenfrei'", "l: 'Gluten-free'"), ("l: 'Laktosefrei'", "l: 'Lactose-free'"),
 ("['salz', 'pfeffer', 'olivenöl', 'sonnenblumenöl', 'rapsöl', 'zucker', 'wasser', 'gemüsebrühe pulver']", "['salt', 'pepper', 'olive oil', 'sunflower oil', 'rapeseed oil', 'sugar', 'water', 'stock powder', 'vegetable stock']"),
 ("['Kartoffeln', 'Eier', 'Nudeln', 'Reis', 'Hähnchenbrust', 'Linsen', 'Brokkoli', 'Spinat', 'Haferflocken', 'Tomate', 'Lachsfilet', 'Naturtofu']", "['Potatoes', 'Eggs', 'Pasta', 'Rice', 'Chicken breast', 'Lentils', 'Broccoli', 'Spinach', 'Rolled oats', 'Tomato', 'Salmon fillet', 'Plain tofu']"),
 ("'Woche vom ____________ bis ____________'", "'Week from ____________ to ____________'"),
]
en = src
missing = []
for a, b in R:
    if a not in en: missing.append(a[:60])
    en = en.replace(a, b)
# Rest an deutschen Zeichen/Wörtern prüfen
left = sorted(set(m for m in re.findall(r"'[^'\n]*[äöüÄÖÜß][^'\n]*'", en)))
open(D + 'planer-en.js', 'w').write(en)
print('nicht gefunden:', missing)
print('übrig mit Umlauten:', left[:30])

# Rezeptdaten
k = json.load(open('/home/claude/work/tr-known.json')); t = json.load(open('/home/claude/work/tr-en.json'))
names = {**{a: b for a, b in k['names'].items() if b}, **t['names']}
ings = {**{a: b for a, b in k['ings'].items() if b}, **t['ings']}
rez = json.load(open(D + 'rezepte.json'))
miss = set()
for r in rez:
    r['n'] = names.get(r['n']) or (miss.add(r['n']) or r['n'])
    for i in r['i']:
        i[0] = ings.get(i[0]) or (miss.add(i[0]) or i[0])
    if r.get('z'):
        r['z'] = t['notes'].get(r['id']) or (miss.add('note:' + r['id']) or r['z'])
json.dump(rez, open(D + 'rezepte-en.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('fehlende Übersetzungen:', sorted(miss))
