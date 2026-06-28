#!/usr/bin/env python3
import json, sys
vals=json.load(sys.stdin)
print('# Parameter Review')
for k,v in vals.items():
    note='review trend and livestock context'
    try: fv=float(v)
    except Exception: fv=None
    if k.lower() in ['ammonia','nitrite'] and fv is not None and fv>0: note='urgent: should normally be 0 in stocked tanks'
    print(f'- {k}: {v} — {note}')
