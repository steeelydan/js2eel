#!/bin/bash

set -e

printf "Typechecking & linting all packages.\n\n" && \
cd ../compiler && printf "Checking /compiler\n" && npm run check && \
cd ../desktop && printf "Checking /desktop\n" && npm run check && \
cd ../gui && printf "Checking /gui\n" && npm run check && \
printf "\nEverything typechecked & linted.\n"