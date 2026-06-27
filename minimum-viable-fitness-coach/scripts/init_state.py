#!/usr/bin/env python3
import argparse, json, pathlib
state={'user_profile':{}, 'current_plan':{}, 'recent_logs':[], 'weekly_reviews':[]}
ap=argparse.ArgumentParser(); ap.add_argument('--file', default='data/fitness_state.json'); args=ap.parse_args()
path=pathlib.Path(args.file); path.parent.mkdir(parents=True, exist_ok=True); path.write_text(json.dumps(state, indent=2))
print(f'initialized {path}')
