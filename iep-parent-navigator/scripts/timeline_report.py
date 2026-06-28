#!/usr/bin/env python3
import argparse, sqlite3
p=argparse.ArgumentParser(); p.add_argument('--db', default='iep_binder.sqlite'); args=p.parse_args()
con=sqlite3.connect(args.db); con.row_factory=sqlite3.Row
print('# IEP Timeline Report')
for row in con.execute("SELECT due_date, task, owner, status FROM tasks ORDER BY COALESCE(due_date,'9999') LIMIT 20"):
    print(f"- [{row['status']}] {row['due_date'] or 'no date'} — {row['task']} ({row['owner'] or 'unassigned'})")
con.close()
