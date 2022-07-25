## this script deploys the static website of move-book-cn to github pages

## build static website for book
mdbook build

## init git repo
cd book
git init
git config user.name "movechina"
git config user.email "movechina@gmail.com"
git add .
git commit -m 'deploy'
git branch -M gh-pages
git remote add origin https://github.com/movechina/move-book-zh.git

## push to github pages
git push -u -f origin gh-pages