#!/bin/bash
tsc -p ./tsconfig.json #compile project to build dri
cp -r src/views/ build/ #move our views to the build directory
cp -r src/clientviews/clientcomponents build/clientviews/
cp -r src/public build/ #also move public files
node build/app