#!/bin/bash

DATA_FOLDER=$(dirname $(dirname $0))/data
CONFIG_FILE=$(dirname $0)/config.json
QUERY_FILE=`dirname $0`/queries/mps.js
COUNT_FILE=`dirname $0`/countMps.js

for row in $(cat $CONFIG_FILE | jq -c -r '.[] | .position.value'); do
    echo $row
    wd sparql $QUERY_FILE $row | jq -c '.[]' | node $COUNT_FILE > $DATA_FOLDER/$row.json
done
