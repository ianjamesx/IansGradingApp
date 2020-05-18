#!/bin/bash
cp -r src/views/ build/ #move our views to the build directory
cp -r src/public build/ #also move public files
node build/app