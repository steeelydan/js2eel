#!/bin/bash

set -e

if [ "$1" == "major" ] || [ "$1" == "minor" ] || [ "$1" == "patch" ]
then
    printf "Bumping all packages: %s" "$1"; \
    cd ../compiler || exit; printf "\nBumping package /compiler\n\n"; npm version "$1"; \
    cd ../desktop || exit; printf "\nBumping package /desktop\n\n"; npm version "$1"; \
    cd ../gui || exit; printf "\nBumping package /gui\n\n"; npm version "$1"; \
    printf "\nBumped all packages to next %s version.\n" "$1"
fi