#!/usr/bin/env python3
import argparse
p=argparse.ArgumentParser(); p.add_argument('--type', default='freshwater', choices=['freshwater','reef','planted','shrimp']); args=p.parse_args()
print('# Maintenance Schedule')
print('- 2-3x/week: observe livestock behavior, appetite, equipment, temperature')
print('- weekly: test key parameters and inspect algae/pests')
if args.type=='reef': print('- weekly: test alkalinity/calcium/magnesium as relevant; clean skimmer/cup')
if args.type in ['planted','shrimp']: print('- weekly: inspect plants/shrimp molts and adjust feeding/fertilization conservatively')
print('- monthly: review trends, equipment, and maintenance log')
