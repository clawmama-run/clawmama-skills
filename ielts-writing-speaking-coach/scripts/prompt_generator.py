#!/usr/bin/env python3
import argparse, random
TASK2=[
'Some people think governments should invest more in public transport than roads. To what extent do you agree or disagree?',
'Many people work from home today. Discuss the advantages and disadvantages.',
'Some believe children should learn practical skills at school. Do you agree or disagree?'
]
SPEAKING2=['Describe a place you would like to visit again.','Describe a skill you want to learn.','Describe a person who influenced you.']
ap=argparse.ArgumentParser(); ap.add_argument('--skill', choices=['task2','speaking2'], default='task2'); args=ap.parse_args()
print(random.choice(TASK2 if args.skill=='task2' else SPEAKING2))
