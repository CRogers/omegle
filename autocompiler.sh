#!/bin/sh

# See https://github.com/CRogers/FileWatcher

filewatcher "src/" "*.coffee" "coffee -b -o lib/ -c :path" "rm lib/:wefile.js" &
filewatcher "tests/" "*.coffee" "coffee -b -o tests/ -c :path" "rm tests/:wefile.js"
