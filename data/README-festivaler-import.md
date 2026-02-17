# Import av 493 festivaler fra regneark

1. **Eksporter regnearket til CSV**
   - Excel: Fil → Lagre som → CSV (komma eller semikolon).
   - Google Sheets: Fil → Last ned → CSV.
   - Lagre filen som `festivaler-493.csv` i mappen `data/`.

2. **Kolonner som brukes**
   - **Festivalens navn** (obligatorisk)
   - **Region** (obligatorisk) – f.eks. Oslo, Vestland, Agder, Trøndelag. Scriptet mapper til Øst/Vest/Nord/Sør/Midt/Innlandet.
   - Valgfritt: **Sjanger**, **Startdato** (brukes til måned), **Fylke**.

3. **Kjør import**
   ```bash
   node scripts/import-festivaler-csv.js data/festivaler-493.csv
   ```
   Dette erstatter innholdet i `festivaler.json` med alle rader fra CSV.

   For å beholde eksisterende og bare legge til nye:
   ```bash
   node scripts/import-festivaler-csv.js data/festivaler-493.csv --merge
   ```

4. **Generer HTML-sider**
   ```bash
   node scripts/generer-festival-sider.js
   ```
