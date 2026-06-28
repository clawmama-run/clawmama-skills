#!/usr/bin/env python3
import argparse, json
from pathlib import Path
p=argparse.ArgumentParser(); p.add_argument('--state', default='tank_state.json'); args=p.parse_args()
state={'tanks':[], 'parameter_readings':[], 'maintenance_events':[], 'incidents':[]}
Path(args.state).parent.mkdir(parents=True, exist_ok=True); Path(args.state).write_text(json.dumps(state, indent=2))
print(f'initialized {args.state}')
