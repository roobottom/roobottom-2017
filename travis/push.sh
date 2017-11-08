#!/bin/sh

if [ -n "$GH_TOKEN" ]; then
  cd "$TRAVIS_BUILD_DIR"
  # This generates a `web` directory containing the website.
  make web
  cd web
  git init
  git checkout master
  git add .
  git -c user.name='travis' -c user.email='travis' commit -m init
  # Make sure to make the output quiet, or else the API token will leak!
  # This works because the API key can replace your password.
  git push -f -q https://roobottom:$GH_TOKEN@github.com/roobottom/roobottom-2017-live &2>/dev/null
  cd "$TRAVIS_BUILD_DIR"
fi
