#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  cd docs
  ls
  git add .
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add master https://$GH_TOKEN@github.com/roobottom/roobottom-2017-live.git &2> /dev/null
  git push --quiet
}

setup_git
commit_website_files
upload_files
