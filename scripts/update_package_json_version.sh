#!/bin/bash

set -e
set -o pipefail

# Check if the debug flag is set
if [[ -n "$DEBUG" ]]; then
  # Enable debugging with set -x
  set -x
fi

if [ -z "$CI_COMMIT_TAG" ]; then
  echo "This build is not associated with a Git tag."
  echo "No changes are made to the package.json version."
  exit 0
fi

# Get the current version from package.json
current_version=$(jq -r '.version' package.json)

# Get the new version from the CI_COMMIT_TAG environment variable
new_version="$CI_COMMIT_TAG"

# Update the version in package.json
jq --arg new_version "$new_version" '.version = $new_version' package.json >package.json.tmp && mv package.json.tmp package.json

echo "Updated package.json version from $current_version to $new_version."
