npm install --global release-it

git remote rm origin
git remote add origin https://sowdri:${GITHUB_TOKEN}@github.com/sowdri/nutso.git
git symbolic-ref HEAD refs/heads/master

npm run build

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
npm run release