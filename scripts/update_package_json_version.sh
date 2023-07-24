#!/bin/bash

set -e
set -o pipefail

# Check if the debug flag is set
if [[ -n "$DEBUG" ]]; then
  # Enable debugging with set -x
  set -x
fi

# Function to get the latest tag
get_latest_tag() {
  git fetch --tags >/dev/null
  git describe --tags "$(git rev-list --tags --max-count=1)" 2>/dev/null || echo "0.0.0"
}

# Function to get the short commit SHA
get_commit_sha() {
  git rev-parse --short HEAD
}

# Get the current version from package.json
current_version=$(jq -r '.version' package.json)

# Get the new version from the CI_COMMIT_TAG environment variable,
# or build a prerelease.
if [[ -n "$CI_COMMIT_TAG" ]]; then
  new_version="$CI_COMMIT_TAG"
else
  new_version="$(get_latest_tag)-pre-$(get_commit_sha)"
fi

# Update the version in package.json
jq --arg new_version "$new_version" '.version = $new_version' package.json >package.json.tmp && mv package.json.tmp package.json

echo "Updated package.json version from $current_version to $new_version."
