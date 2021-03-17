#!/bin/bash

set -e

cd "$(dirname "$0")"

wget=`which wget`
unzip=`which unzip`

if [ ! -x "$wget" ]; then
    echo "Could not find wget in path.."
    exit 1;
fi

if [ ! -x "$unzip" ]; then
    echo "Could not find unzip in path.."
    exit 1;
fi


if [ ! -f ./IN.txt ]; then
    echo "Fetching India Zipcodes CSV File From geonames "
    $wget -nv "http://download.geonames.org/export/zip/IN.zip"
    $unzip -oq "IN.zip" "IN.txt"
fi


wait

echo "Processing CSV file."

./processIndia.js

wait

rm ./IN.zip*
rm ./IN.txt

wait

echo "Build Complete"
