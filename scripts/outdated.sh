#!/bin/bash

printf "Checking dependency updates for all packages.\n"; \
cd ../compiler || exit; printf "\nChecking dependency updates in /compiler\n\n"; npm outdated; \
cd ../desktop || exit; printf "\nChecking dependency updates in /desktop\n\n"; npm outdated; \
cd ../gui || exit; printf "\nChecking dependency updates in /gui\n\n"; npm outdated; \
printf "\nAll dependencies are up to date.\n"