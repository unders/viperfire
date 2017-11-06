#!/usr/bin/env bash
##
## hasher adds the hash of the content to the filename
##

function update() {
    local old=$1
    local new=$2

    for file in $(find dist/assets);
    do
        if [ -f "$file" ];then
            sed -i oldx "s|$old|$new|g" ${file}
            rm ${file}oldx
        fi
    done

    for file in $(find functions/build/shared);
    do
        if [ -f "$file" ];then
            sed -i oldx "s|$old|$new|g" ${file}
            rm ${file}oldx
        fi
    done
}

function updateFiles() {
    for file in $(find dist/assets);
    do
        if [ -f "$file" ];then
            local hash=$(openssl sha1 ${file} | awk '{print $2}')
            local path=${file#*dist/}
            local base=$(basename ${path})
            local dir=$(dirname ${path})
            update ${path} "$dir/$hash-$base"
        fi
    done
}

function rename() {
    local old=$1
    local new=$2

    mv ${old} ${new}
 }

renameFiles() {
    for file in $(find dist/assets);
    do
        if [ -f "$file" ];then
            local hash=$(openssl sha1 ${file} | awk '{print $2}')
            local base=$(basename ${file})
            local dir=$(dirname ${file})
            rename ${file} "$dir/$hash-$base"
        fi
    done
}

main() {
    updateFiles
    renameFiles
}

main
