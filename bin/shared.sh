#!/usr/bin/env bash

main() {
    file=$1

    cp ${file} src/${file#./functions/src/}
}

main $@
