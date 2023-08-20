#!/bin/bash

set -e

printf "Installing dependencies for all Node projects.\n" && \
cd ../compiler && printf "\nInstalling packages for /compiler\n\n" && npm ci && \
printf "\nBuilding /compiler\n" && npm run dist && \
cd ../desktop && printf "\nInstalling packages for /desktop\n\n" && npm ci && \
cd ../gui && printf "\nInstalling packages for /gui\n\n" && npm ci && \
printf "\nSetup done. Now you can:\n\n" && \
printf "Build & watch the compiler code: cd ../compiler && npm run dev\n" && \
printf "Build & watch the desktop client: cd ../desktop && npm run dev\n" && \
printf "Build & watch the gui: cd ../gui && npm run dev\n"