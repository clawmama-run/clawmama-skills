#!/usr/bin/env python3
import argparse, sqlite3, json
ap=argparse.ArgumentParser(); ap.add_argument('--db', default='data/job_search.sqlite'); args=ap.parse_args()
con=sqlite3.connect(args.db); con.row_factory=sqlite3.Row
stages=con.execute('select stage, count(*) n from jobs group by stage').fetchall()
followups=con.execute('select title, next_action, next_action_due from jobs where next_action_due is not null order by next_action_due limit 20').fetchall()
print(json.dumps({'by_stage':[dict(r) for r in stages], 'followups_due':[dict(r) for r in followups]}, ensure_ascii=False, indent=2))
