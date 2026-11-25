#!/usr/bin/env bash
# Builds the GitHub Pages site into _site/:
#   main            -> the site root (what visitors see)
#   every branch    -> preview/<branch-name>/ (hidden from search engines)
# Expects the remote branches to be fetched as refs/remotes/origin/*.
set -euo pipefail

out="${1:-_site}"
base_url="${2:-}"
rm -rf "$out"
mkdir -p "$out"

export_ref() {
  mkdir -p "$2"
  git archive "$1" | tar -x -C "$2"
  rm -rf "$2/.github"
}

export_ref origin/main "$out"

previews=()
while read -r branch; do
  if [ "$branch" = main ] || [ "$branch" = HEAD ]; then continue; fi
  path=$(printf '%s' "$branch" | sed 's#[^A-Za-z0-9._/-]#-#g')
  dest="$out/preview/$path"
  export_ref "origin/$branch" "$dest"
  # Keep previews out of search results.
  find "$dest" -name '*.html' -exec sed -i '0,/<head>/s##<head>\n  <meta name="robots" content="noindex">#' {} +
  previews+=("$branch|preview/$path/")
done < <(git for-each-ref --format='%(refname:lstrip=3)' refs/remotes/origin)

summary="${GITHUB_STEP_SUMMARY:-/dev/stdout}"
{
  echo "## Site"
  echo "- main: ${base_url}/"
  echo "## Branch previews"
  if [ ${#previews[@]} -eq 0 ]; then echo "None."; fi
  for p in "${previews[@]}"; do
    echo "- ${p%%|*}: ${base_url}/${p#*|}"
  done
} >> "$summary"
