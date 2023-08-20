#!/bin/bash

set -e

printf "Building & distributing.\n\n" && \
cd ../compiler && printf "Building & distributing /compiler\n" && npm run dist && \
cd ../gui && printf "Building & distributing /gui\n" && npm run dist && \
cd ../desktop && printf "Building & distributing /desktop\n" && \

# os_name=$(uname -s)

# if [ "$os_name" == "Darwin" ]; then
#     npm run dist:mac
# elif echo "$os_name" | grep -q "MINGW64"; then
#     npm run dist:win
# else
#     npm run dist:linux
# fi

npm run dist && \


printf "\nEverything built & distributed.\n"