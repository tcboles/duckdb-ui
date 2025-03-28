#!/bin/bash

set -e

TAG=$(git describe --tags --abbrev=0)

echo "Repushing tag: $TAG"

# Delete the local and remote tag
git tag -d "$TAG"
git push origin ":refs/tags/$TAG"

# Recreate and push the tag
git tag "$TAG"
git push origin "$TAG"

echo "✅ Tag $TAG re-pushed successfully"