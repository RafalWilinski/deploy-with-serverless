#!/bin/bash
set -e

rm -f ./password.yml

passwd=$(cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
printf "password: %s" "$passwd" > ./password.yml

printf "Password generated!"
