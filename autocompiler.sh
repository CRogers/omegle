#!/bin/sh

# See https://github.com/CRogers/FileWatcher

filewatcher "src/" "*.coffee" "coffee -o lib/ -c :path" "rm lib/:wefile.js" &
filewatcher "tests/" "*.coffee" "coffee -o tests/ -c :path" "rm tests/:wefile.js"
