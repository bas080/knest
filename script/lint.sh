#!/bin/bash

prettier_eslint="./node_modules/.bin/prettier-eslint"

for file in $@; do
  diff -q <($prettier_eslint $file) $file || exit 1
done
