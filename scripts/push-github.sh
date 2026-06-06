#!/usr/bin/env bash
set -euo pipefail

GITHUB_USER="${GITHUB_USER:-timdfrost}"
REPO_URL="https://github.com/${GITHUB_USER}/isoml.git"

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "Pushing to $REPO_URL"
echo "Create an empty repo at https://github.com/new?name=isoml if it does not exist yet."
git push -u origin main
