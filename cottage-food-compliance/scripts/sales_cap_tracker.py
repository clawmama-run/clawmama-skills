#!/usr/bin/env python3
import argparse
p=argparse.ArgumentParser(); p.add_argument('--cap', type=float, required=True); p.add_argument('--sales', type=float, required=True); args=p.parse_args()
pct=(args.sales/args.cap*100) if args.cap else 0
print(f'Sales: ${args.sales:,.2f} / cap ${args.cap:,.2f} ({pct:.1f}%)')
if pct>=90: print('Warning: near or over cap; verify rules and plan next steps.')
elif pct>=75: print('Caution: approaching cap.')
else: print('OK: below cap based on supplied values.')
