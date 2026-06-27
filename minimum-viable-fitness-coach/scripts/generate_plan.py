#!/usr/bin/env python3
import json, sys
inp=json.load(sys.stdin)
days=int(inp.get('days_per_week',2)); minutes=int(inp.get('minutes_per_session',20)); equipment=inp.get('equipment',[])
plan={'weekly_schedule':[], 'safety_note':'General fitness guidance only; stop and seek medical advice for red flags.', 'progression_rule':'If completion >=80% and RPE <=7, add 1-2 reps or 5 minutes next week.', 'fallback_rule':'Do one 8-10 minute round instead of skipping.'}
for i in range(days):
    plan['weekly_schedule'].append({'session':i+1,'minutes':minutes,'type':'full-body strength' if i<2 else 'walk/cardio','target_rpe':'6-7'})
print(json.dumps(plan, ensure_ascii=False, indent=2))
