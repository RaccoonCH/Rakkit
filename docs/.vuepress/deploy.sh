#!/usr/bin/env sh

set -e

npm run docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f https://owencalvin:${GITHUB_TOKEN}@github.com/RaccoonCH/Rakkit.git master:gh-pages

cd ..
rm -rf dist

cd -
