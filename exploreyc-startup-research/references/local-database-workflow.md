# Export → Local Database Workflow

For any analysis needing more than a handful of API calls (Free tier: 5/day), work from an ExploreYC export instead of looping over the API.

## 1. Get the export

ExploreYC's export feature produces CSV or JSON for a filtered view. Build the URL with:

```bash
python3 exploreyc-startup-research/scripts/exploreyc.py export-url --format csv --industry Fintech --source yc
```

The user downloads the file from ExploreYC (export auth semantics may differ from the v1 API — if the URL alone doesn't work, ask the user to export from the ExploreYC website UI) and drops it into the workspace, e.g. `data/exploreyc/fintech-yc.csv`.

## 2. Load into SQLite

```bash
sqlite3 data/exploreyc/exploreyc.db ".mode csv" ".import data/exploreyc/fintech-yc.csv companies"
```

For JSON exports, parse with Python stdlib (`json` + `sqlite3`) into a `companies` table keyed on `slug`.

## 3. Analyze locally

Typical queries: counts by `batch`/`industry`/`stage`, hiring companies by country, keyword filters on `one_liner`. Every follow-up question is now free — no API spend.

## 4. Record freshness

Store the export date alongside the data (e.g. a `_meta` table or filename suffix) and cite it in every brief. Refresh the export rather than assuming the local copy is current.
