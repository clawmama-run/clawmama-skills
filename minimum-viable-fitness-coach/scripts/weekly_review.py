#!/usr/bin/env python3
import json, sys
d=json.load(sys.stdin); planned=max(float(d.get('planned',1)),1); completed=float(d.get('completed',0)); avg_rpe=float(d.get('avg_rpe',7)); pain=bool(d.get('pain_flags',0)); rate=completed/planned
if pain: decision='modify conservatively and consider professional guidance'
elif rate<0.6: decision='reduce plan volume/time and identify barriers'
elif rate<0.8: decision='repeat plan and improve scheduling'
elif avg_rpe<=7: decision='progress slightly'
else: decision='repeat or reduce intensity'
print(json.dumps({'completion_rate':round(rate,2),'decision':decision}, indent=2))
