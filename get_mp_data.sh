#!/bin/bash

DATA_FOLDER=./website/data
CONFIG_FILE=./website/data/config.json
QUERY_FILE=./queries/mps.js
COUNT_FILE=./count_mps.js

for row in $(cat $CONFIG_FILE | jq -c -r '.[] | .position.value'); do
    echo $row
    wd sparql $QUERY_FILE $row | jq -c '.[]' | node $COUNT_FILE > $DATA_FOLDER/$row.json
done
