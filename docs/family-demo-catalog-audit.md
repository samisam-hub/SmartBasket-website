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
