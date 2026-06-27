#!/usr/bin/env python3
import json, sys
data=json.load(sys.stdin)
keys=data.get('criteria') or []
if not keys:
    keys=[data.get(k) for k in ['task','coherence','lexical','grammar'] if data.get(k) is not None]
score=round((sum(map(float,keys))/len(keys))*2)/2 if keys else None
print(json.dumps({'estimated_band': score, 'note': 'AI estimate only; official IELTS results may differ.'}, indent=2))
