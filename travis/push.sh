#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

copy_generated_files() {
  rsync -r --exclude=.git ./docs/ ~/roobottom-deploy/
  cd ~/roobottom-deploy
}

commit_website_files() {
  git init
  git add .
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add master https://$GH_PUSH_TOKEN@github.com/roobottom/roobottom-2017-live.git &2> /dev/null
  git push --set-upstream master master
}

setup_git
copy_generated_files
commit_website_files
upload_files
