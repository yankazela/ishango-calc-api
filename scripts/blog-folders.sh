#!/usr/bin/env bash

BUCKET="ishango-saas-dev"
PARENT="blog/corporate-tax"
PROFILE="yannick-admin"

countries=(br ca es fr ge in jp uk us za)
languages=(en fr de es ja pt)

for country in "${countries[@]}"; do
  for lang in "${languages[@]}"; do
    aws s3 cp ./test.txt "s3://${BUCKET}/${PARENT}/${country}/${lang}/" --profile "$PROFILE"
  done
done
