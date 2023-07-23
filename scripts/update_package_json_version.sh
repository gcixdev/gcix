#!/bin/bash

set -xe

pwd
ls -l

# Get the current version from package.json
current_version=$(jq -r '.version' package.json)

# Get the new version from the CI_COMMIT_TAG environment variable
new_version="$CI_COMMIT_TAG"

# Update the version in package.json
jq --arg new_version "$new_version" '.version = $new_version' package.json >package.json.tmp && mv package.json.tmp package.json

echo "Updated package.json version from $current_version to $new_version."
