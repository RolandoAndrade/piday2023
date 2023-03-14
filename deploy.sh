#!/usr/bin/env sh
set -e

npm run build

cd dist

git init
echo "rolandoandrade.me" > "CNAME"
git add -A
git commit -m 'deploy'
git push -f git@github.com:RolandoAndrade/piday2023.git master:deploy
cd -