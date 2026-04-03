#!/bin/bash

# List all local branches except the current one
branches=$(git branch --format="%(refname:short)" | grep -v "^$(git branch --show-current)$")


for branch in $branches; do
  read -p "Do you want to delete branch '$branch'? [y/N]: " answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    git branch -D "$branch"
    echo "Deleted $branch"
  else
    echo "Kept $branch"
  fi
done

