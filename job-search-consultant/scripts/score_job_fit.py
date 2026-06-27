#!/usr/bin/env python3
import json, sys
weights={'role_match':20,'skill_match':25,'seniority_match':15,'location_comp_fit':15,'company_interest':10,'referral_path':10,'application_effort':5}
data=json.load(sys.stdin)
score=sum((float(data.get(k,0))/5)*w for k,w in weights.items())
print(json.dumps({'fit_score':round(score), 'recommendation':'apply' if score>=70 else 'consider' if score>=50 else 'skip'}, indent=2))
