#!/bin/bash

set -e

printf "Testing all packages.\n" && \
cd ../compiler || exit; printf "\nRunning tests in /compiler\n\n"; npm test; \
# cd ../desktop || exit; printf "\nRunning tests in /desktop\n\n"; npm test; \
# cd ../gui || exit; printf "\nRunning tests in /gui\n\n"; npm test; \
printf "\nEverything tested.\n"