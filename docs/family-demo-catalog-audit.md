# SmartBasket – Gerichtkatalog-Bestandsaufnahme (22.10.2026)

## Quellen
- App: `samisam-hub/SmartBasket/data/meals.ts` (34 direkt definierte Gerichte)
- App: `samisam-hub/SmartBasket/data/german-everyday-meals.json` (64 deutsche Alltagsgerichte)
- Website: `dist/de/familie-demo.js` (`SB_DISHES`: 12 Einträge, darunter Auswärtsessen und Fertiglasagne)

**98 App-Gerichte und 12 Website-Demo-Auswahlen sind nicht automatisch identisch.** Die Website verwendet eigene IDs, Zutaten-Keys, Nährwert- und Preisbeispiele. Ein reines Zusammenkopieren würde die Einkaufslistenlogik gefährden.

## Website-Demo → bestehende App-ID (vorläufig)
| Website-ID | Website-Titel | App-ID | Status |
|---|---|---|---|
| sunny | Spiegelei auf Sauerteigbrot | sunny-side-toast | Rezept prüfen (Website- und App-Namen abweichend) |
| muesli | Joghurt-Müsli mit Beeren | yogurt-fruit | Rezept prüfen |
| oat | Haferbrei mit Beeren | oat-berries | Rezept prüfen |
| chickpot | Hähnchen mit Kartoffeln und Brokkoli | chicken-potato | Rezept prüfen |
| tunapasta | Nudeln mit Tomaten-Thunfisch-Soße | tuna-pasta | Rezept prüfen |
| lentil | Linsen-Pasta mit Tomaten | lentil-pasta | Rezept prüfen |
| stroganoff | Hähnchen-Geschnetzeltes mit Nudeln | chicken-stroganoff | Zutaten prüfen: Website `cream`, App `soy_cream` |
| eggs | Rührei mit Kartoffeln und Spinat | scrambled-eggs | Rezept prüfen |
| lasagne | Lasagne zum Aufwärmen | — | Convenience-Produkt, nicht mit selbstgekochter Lasagne verwechseln |
| toast | Abendbrot mit Ei und Hähnchenschinken | chicken-ham-toast | Frühstück in App, Abendessen in Demo; Slot-Metadaten ergänzen |
| salmon | Lachs mit Reis und Brokkoli | salmon-rice | Rezept prüfen |
| out | Auswärts essen | — | Sonderaktion, kein Rezept |

## Sichtbare Lücken
- Die 64 deutschen Alltagsgerichte besitzen keine Bildfelder im JSON; Bildauflösung an anderer Stelle noch prüfen.
- Im App-Katalog gibt es nur die vier primären Slot-Typen `breakfast`, `lunch`, `dinner`, `snack`; Schulbrotdose und Abendbrot sind noch keine eigenständigen Kategorien.
- Die Website-Demo nutzt 12 eigene Einträge und separate Bildpfade. **Bilddateien wurden nicht vollständig auf Existenz geprüft.**
- Preise in der Website-Demo sind ausdrücklich Beispieldaten, keine Live-Händlerpreise.

## Nächster sicherer Implementierungsschritt
1. Bestehende Bilddateien gegen die zwölf Pfade verifizieren.
2. Alle 98 App-Gerichte maschinell auf Zutaten-Keys, Mengen, doppelte IDs und kompatible Slots prüfen.
3. Nicht-invasive Metadaten `familyCategory` und `imageKey` zunächst separat als Mapping anlegen, keine gespeicherten IDs ändern.
4. Demo erst nach Regressionstest an eine gemeinsame Katalogquelle anschließen.

## Schutz der bestehenden Demo
Dieser Audit ändert keine ausführbaren Dateien, keine Preise, keine Einkaufslogik und keine Datenbank.

## Prüfung 22.10.2026 – Bilder und Zutatenreferenzen

### Demo-Bilder
Alle 12 in `dist/de/familie-demo.js` per `img` referenzierten WebP-Dateien wurden einzeln über die GitHub-Dateischnittstelle unter `dist/assets/` nachgeschlagen: **12/12 vorhanden**.

| Demo-ID | Bilddatei | GitHub-Datei |
|---|---|---|
| sunny | breakfast.webp | vorhanden |
| muesli | yogurtbowl.webp | vorhanden |
| oat | oats.webp | vorhanden |
| chickpot | chickenpotato.webp | vorhanden |
| tunapasta | tunapasta.webp | vorhanden |
| lentil | lentilpasta.webp | vorhanden |
| stroganoff | stroganoff.webp | vorhanden |
| eggs | scrambled.webp | vorhanden |
| lasagne | heatandeat.webp | vorhanden |
| toast | hamtoast.webp | vorhanden |
| salmon | salmonrice.webp | vorhanden |
| out | eatout.webp | vorhanden |

Dies prüft Dateiexistenz, **nicht** Bildqualität, visuelle Rezepttreue, Lizenzen, Pixelmaße oder HTTP-Auslieferung.

### Alltagsrezepte
- 64 Gerichte in `data/german-everyday-meals.json`, **319 Zutatenpositionen**.
- 319/319 Mengen sind positiv und referenzieren definierte Zutaten aus `data/meals.ts`, `data/everyday-ingredients.json` oder kanonischen Alias-Schlüsseln (`wholemeal_bread`, `olive_oil`, `chicken_breast`, `chopped_tomatoes`).
- Keine doppelten Zutaten-Definitionsschlüssel innerhalb `everyday-ingredients.json` gefunden.
- Alle 64 besitzen mindestens einen Mahlzeitenslot und Zubereitungshinweise.
- Alle 64 enthalten im JSON kein `image` oder `imageUrl`; eine externe Bildzuordnung wurde nicht ausgeschlossen.

### Noch offen
- Echte SKU-Abdeckung je Zutatenkonzept, Allergene und Nährwertplausibilität gesondert prüfen.
- Hochauflösende Rezeptbilder mit passender Darstellung und Nutzungsrechten erstellen/zuordnen.
- Für neue Bilder Bildmanifest mit eindeutiger Rezept-ID, Alt-Text, Quellen- und Qualitätsangaben erstellen.
- Keine ausführbare Demo-Datei ändern, bevor Regressionstests vorliegen.
