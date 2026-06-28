#!/usr/bin/env python3
import json, sys
label=json.load(sys.stdin)
required=['product_name','ingredients','allergens','net_weight']
print('# Label Check')
for key in required:
    print(f"- {key}: {'present' if label.get(key) else 'missing'}")
print('- disclosure: verify exact required wording with local authority')
