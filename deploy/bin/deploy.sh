#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color

while true; do
    echo -e "${RED}You are deploying to production. Proceed?${NC}"
    read -p "Yes | No ? " yn
    echo ""
    case ${yn} in
        [Yy]* ) echo "deploy to prod"; break;; ## firebase deploy
        [Nn]* ) exit;;
        * ) exit;;
    esac
done
