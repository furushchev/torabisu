#!/bin/bash

if [ "$(basename `pwd`)" != "torabisu" ]; then
    echo "please execute in \"torabisu\" directory"
    exit 1
fi

git clean -dfix
(cd  src; zip -r ../torabisu.zip ./*)
