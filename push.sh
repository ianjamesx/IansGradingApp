#!/bin/bash
git add src
git add package.json
git add package-lock.json
git add push.sh
git add prod
git commit -m $1
git push -u origin master
