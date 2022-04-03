#!/bin/bash

set -a
source <(cat .env | \
    sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

npx wrangler pages dev ./dist/ --binding FIREBASE_CONFIG="$FIREBASE_CONFIG"
