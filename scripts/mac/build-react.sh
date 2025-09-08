#!/bin/bash

# Setup paths
PROJECT_ROOT="$(dirname "$0")/../.."

cd $PROJECT_ROOT

# Build the react app
npm run --prefix ./react-app/ build

# Delete all contents of public path assuming you are in the PROJECT_ROOT
rm -r ./public/*

# Copy all contents of the react-app's build directory into the public path
cp -a ./react-app/build/. ./public/
