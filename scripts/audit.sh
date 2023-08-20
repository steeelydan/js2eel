#!/bin/bash
printf "Auditing dependencies for all packages.\n"; \
cd ../compiler || exit; printf "\nAuditing dependencies in /compiler\n\n"; npm audit; \
cd ../desktop || exit; printf "\nAuditing dependencies in /desktop\n\n"; npm audit; \
cd ../gui || exit; printf "\nAuditing dependencies in /gui\n\n"; npm audit; \
printf "\nAll dependencies are up to date.\n"