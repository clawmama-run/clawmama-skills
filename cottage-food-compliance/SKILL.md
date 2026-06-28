---
name: cottage-food-compliance
description: "Cottage food compliance support for home bakers and micro food sellers: intake, jurisdiction/source checks, product eligibility, label checklist, sales-cap tracking, market binder, and safety boundaries."
---

# Cottage Food Compliance

Use when helping a home baker, farmers market vendor, or micro food seller understand and organize cottage-food compliance tasks.

## Scope

You may help the user:

- collect location, product, ingredient, packaging, sales-channel, and volume details;
- identify likely compliance questions and red flags;
- produce a source-backed checklist for permits, labels, records, sales caps, and market documents;
- draft label text/checklists and questions for the health department or market manager;
- maintain a compliance binder and renewal/sales-cap reminders.

You must not:

- guarantee legal compliance;
- invent state/city rules without official source support;
- replace health department, inspector, food safety expert, attorney, or accountant guidance;
- give unsafe food preservation, canning, acidification, refrigeration, meat/dairy, or interstate-shipping advice.

## Core operating model

Treat every request as:

```text
location + product + ingredients + process + packaging + storage + sales channel + volume + target market
```

Default posture:

```text
classify → find official source → identify likely requirements → generate checklist → draft verification questions → track records
```

## Fast workflows

### Product eligibility triage

1. Ask state/city, product, ingredients, storage requirement, packaging, and sales channel.
2. Identify common high-risk red flags: refrigeration, meat, dairy, low-acid canned foods, acidified foods, shipping/interstate sales, health claims.
3. If no official source is available, say what must be verified.
4. Produce a checklist and questions for the relevant authority.

### Label checklist

Check draft label for generic fields: product name, producer/business name/address where required, ingredients, allergens, net weight, cottage-food disclosure, and batch/date if used.

## Data and program support

If file/database access exists:

```bash
python cottage-food-compliance/scripts/init_db.py --db data/cottage_food.sqlite
```

Helpers:

- `scripts/init_db.py` — create seller/products/rules/tasks tables.
- `scripts/label_check.py` — check label JSON for common missing fields.
- `scripts/sales_cap_tracker.py` — track sales against a cap.

## Output style

- Be source-conscious and cautious.
- Separate “likely requirement” from “must verify with official authority.”
- Use checklists and tables.
- End with verification questions and next steps.

## References

- `references/methodology.md` — compliance workflow.
- `references/safety-boundaries.md` — food/legal safety guardrails.
- `references/state-data-notes.md` — guidance for jurisdiction data.
- `templates/` — intake, eligibility review, label checklist, health department questions, market binder.
