#!/usr/bin/env python3
import json, sys
items=json.load(sys.stdin) if not sys.stdin.isatty() else []
print('# Accommodation Review')
for it in items:
    need=it.get('need',''); cur=it.get('current',''); req=it.get('requested','')
    status='gap' if req and req.lower()!=cur.lower() else 'covered'
    print(f"- {need}: {status}. Current: {cur or 'none'}; Requested: {req or 'none'}")
