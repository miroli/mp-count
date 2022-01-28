#!/bin/bash

wd sparql `dirname $0`/queries/parliaments.rq > `dirname $0`/config.json
