#!/bin/bash

for row in $(cat config.json | jq -c '.[] | [.position, .countryLabel]'); do
    position=$(echo ${row} | jq -r '.[0]')
    country=$(echo ${row} | jq -r '.[1]' | tr '[:upper:]' '[:lower:]')
    echo $country
    wd sparql `dirname $0`/queries/mps.js $position | jq -c '.[]' | node `dirname $0`/countMps.js > `dirname $0`/$country.json
done
