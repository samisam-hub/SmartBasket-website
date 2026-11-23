# Geschätzte Durchschnittspreise im deutschen Supermarkt/Discounter, € pro kg bzw. Liter (Stk. = pro Stück).
# Bewusst gerundete Schätzwerte – nur für die anteilige Kosten-Schätzung im Wochenplaner.
P = {
"Apfel":2.5,"Apfelmus":2.0,"Aufbackbrötchen":3.0,"Backpulver":6.0,"Banane":1.6,"Basilikum frisch":30,"Basilikumpesto mit mikrobiellem Lab":12,
"Basismüsli ohne Nüsse":3.5,"Basmatireis":3.5,"Beeren":8.0,"Blattsalat frisch":4.0,"Branntweinessig":1.0,"Brokkoli":3.0,"Butter":9.0,"Champignons":5.0,
"Currypulver mild":25,"Eier":4.5,"Eierspätzle frisch":4.0,"Entenbrust mit Haut":18,"Erbsen tiefgekühlt":2.5,"Erdbeerkonfitüre":4.5,"Feta":10,
"Fischstäbchen tiefgekühlt":8.0,"Flammkuchenteig gekühlt":6.0,"Frische Kirschtomaten":5.0,"Frische Petersilie":25,"Frischer Dill":25,"Frischkäse natur":6.0,
"Geflügelschinken":12,"Gehackte Tomaten":1.8,"Gekochter Schweineschinken":11,"Gemahlene blanchierte Mandeln":12,"Gemüsebrühe Pulver":10,"Geriebener Käse":9.0,
"Gewürzgurken abgetropft":3.0,"Gewürznelken (ganz)":60,"Gnocchi frisch ohne Ei":3.5,"Gouda mit mikrobiellem Lab":9.0,"Griechischer Naturjoghurt":4.0,"Grobes Salz":1.0,
"Gurke":2.0,"Haferflocken":1.5,"Hirschgulasch":25,"Honig":10,"Hummus natur mit Sesam":8.0,"Hähnchenbrust":10,"Hähnchenhackfleisch":9.0,
"Hähnchenschenkelfleisch mit Haut ohne Knochen roh":8.0,"Italienische Kräuter getrocknet":30,"Kardamom (gemahlen)":80,"Karotten":1.3,"Kartoffeln":1.3,"Kartoffelstärke":3.0,
"Kichererbsen":2.5,"Kidneybohnen aus der Dose abgetropft":3.0,"Knoblauch":8.0,"Knoblauch getrocknet":25,"Knoblauchpulver":25,"Knollensellerie":2.5,"Kokosmehl":10,
"Kokosmilch":3.5,"Kreuzkümmel (gemahlen)":30,"Käsetortellini frisch mit mikrobiellem Lab":6.0,"Körniger Frischkäse":4.5,"Lachsfilet":22,"Lammfleisch zum Schmoren":20,
"Lasagneplatten trocken ohne Ei":3.0,"Lauch frisch":3.0,"Linsen":3.0,"Lorbeerblätter (getrocknet)":50,"Magerquark":2.5,"Mais aus der Dose abgetropft":3.0,
"Maultaschen mit Fleisch frisch":7.0,"Milchfreie dunkle Schokolade":12,"Milchreis trocken":2.5,"Mozzarella mit mikrobiellem Lab":7.0,"Naturjoghurt 3,5 %":2.2,"Naturtofu":8.0,
"Nori-Blätter":0.25,"Nudeln":1.8,"Olivenöl":10,"Paniermehl":2.5,"Paprika frisch":4.5,"Paprikapulver edelsüß":25,"Passierte Tomaten natur":1.6,"Pfifferlinge":25,
"Pizzateig gekühlt":5.0,"Putenbrust":12,"Reis":2.5,"Rindergulasch":16,"Rinderhackfleisch roh":10,"Rindersteak":28,"Rosinen":6.0,"Rote Bete":2.5,
"Rote Linsen trocken":4.0,"Rotkohl / Blaukraut":1.5,"Rotwein":5.0,"Räucherlachs":28,"Sauerkirschen aus dem Glas abgetropft":4.0,"Sauerteigbrot":5.0,
"Schlagsahne 30 %":4.5,"Schmand 24 %":4.0,"Schnittlauch frisch":25,"Schwarzer Pfeffer":40,"Schweinebratwurst roh":8.0,"Schweineschnitzel natur roh":10,
"Senf mittelscharf":4.0,"Sesam":8.0,"Soja-Kochcreme":4.0,"Sonnenblumenöl":2.5,"Speck gewürfelt":10,"Spinat":5.0,"Suppennudeln trocken ohne Ei":3.0,
"Tellerlinsen trocken":3.0,"Teriyaki-Marinade":10,"Thunfisch im eigenen Saft":10,"Tomate":3.0,"Tomatenmark":5.0,"Trockenhefe":15,"Vollkornbrot":3.5,
"Vollmilch 3,5 %":1.1,"Wacholderbeeren (getrocknet)":60,"Weichweizengrieß":2.0,"Weizenbrötchen frisch":4.0,"Weizenmehl Type 405":0.9,"Weizennudeln / Spaghetti":1.8,
"Weizentoast":2.5,"Weizentortillas":5.0,"Weißkohl":1.2,"Wiener Würstchen":9.0,"Wildpreiselbeeren im Glas (gezuckert)":10,"Zimt gemahlen":20,
"Zitrone essbarer Anteil":4.0,"Zucker":1.0,"Zwiebel":1.5,
}
import json
for f in ['rezepte.json','rezepte-en.json']:
    d=json.load(open(f))
    de=json.load(open('rezepte.json'))
    deI={r['id']:r for r in de}
    miss=set()
    for r in d:
        cost=0
        for i,ide in zip(r['i'],deI[r['id']]['i']):
            name,q,u=ide
            if name not in P: miss.add(name); continue
            cost += P[name]*q if u=='Stk.' else P[name]*q/1000
        r['eur']=round(cost,2)
    json.dump(d,open(f,'w'),ensure_ascii=False,separators=(',',':'))
    print(f,'missing',miss, sorted((r['eur'],r['id']) for r in d)[:3], sorted((r['eur'],r['id']) for r in d)[-3:])
json.dump({r['id']:r['eur'] for r in json.load(open('rezepte.json'))},open('prices.json','w'))
