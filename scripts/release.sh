#!/usr/bin/env bash
# scripts/release.sh — cut a tagged release.
#
# What it does:
#   1. Bumps the `version` field in package.json (semver: major | minor | patch | <explicit>).
#   2. Promotes CHANGELOG.md's [Unreleased] block to [<new-version>] with today's date.
#   3. Creates a commit (`chore(release): vX.Y.Z`) and an annotated tag (`vX.Y.Z`) locally.
#   4. Prints the push commands — you push manually.
#
# Why manual push:
#   Tags are load-bearing for downstream automation (release-please, CHANGELOG links,
#   `git describe`). Forcing a human ack on the push prevents an agent or a misfired
#   script from publishing a tag the maintainer didn't sign off on.
#
# Usage:
#   ./scripts/release.sh patch          # 0.1.0 -> 0.1.1
#   ./scripts/release.sh minor          # 0.1.0 -> 0.2.0
#   ./scripts/release.sh major          # 0.1.0 -> 1.0.0
#   ./scripts/release.sh 0.1.0          # explicit version (no v-prefix; the tag gets it)
#   ./scripts/release.sh --bootstrap    # tag current HEAD with package.json's version
#                                       # without bumping (one-shot for repos that already
#                                       # have a version but no matching tag — see #35)
#
# See RELEASING.md for the full release flow.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# ---------- helpers ----------

die() {
  echo "release: $*" >&2
  exit 1
}

# Read package.json's "version" field without pulling node_modules.
read_pkg_version() {
  node -p "require('./package.json').version"
}

# Write a new version into package.json, preserving formatting.
write_pkg_version() {
  local new_version="$1"
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.version = process.argv[1];
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  ' "$new_version"
}

# Bump a semver string by component. Supports: major | minor | patch | <explicit>.
bump_semver() {
  local current="$1"
  local kind="$2"

  if [[ "$kind" == "major" || "$kind" == "minor" || "$kind" == "patch" ]]; then
    local major minor patch
    IFS='.' read -r major minor patch <<< "$current"
    case "$kind" in
      major) echo "$((major + 1)).0.0" ;;
      minor) echo "${major}.$((minor + 1)).0" ;;
      patch) echo "${major}.${minor}.$((patch + 1))" ;;
    esac
  elif [[ "$kind" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
    echo "$kind"
  else
    die "invalid bump kind '$kind' — expected major|minor|patch|X.Y.Z"
  fi
}

# Promote [Unreleased] in CHANGELOG.md to [<version>] - <today>, and add a
# fresh [Unreleased] header above it. Also updates the bottom-of-file compare
# links so [<version>] points at the new tag and [Unreleased] compares against
# the new tag. Idempotent against missing CHANGELOG — no-op if absent.
update_changelog() {
  local new_version="$1"
  local today
  today="$(date -u +%Y-%m-%d)"

  if [ ! -f CHANGELOG.md ]; then
    echo "release: no CHANGELOG.md — skipping changelog update"
    return 0
  fi

  # Pure-bash + node implementation to avoid sed portability issues across
  # GNU / BSD sed. Read whole file, transform, write back.
  node -e '
    const fs = require("fs");
    const [newVersion, today] = process.argv.slice(1);
    let src = fs.readFileSync("CHANGELOG.md", "utf8");

    // 1. Promote ## [Unreleased] header to ## [<new>] - <today>, then add a
    //    new empty ## [Unreleased] above it.
    const unreleasedRe = /^## \[Unreleased\]\s*$/m;
    if (!unreleasedRe.test(src)) {
      console.error("release: CHANGELOG.md has no [Unreleased] section — leaving untouched");
      process.exit(0);
    }
    src = src.replace(
      unreleasedRe,
      `## [Unreleased]\n\n## [${newVersion}] - ${today}`
    );

    // 2. Update compare links at the bottom. Match either form:
    //      [Unreleased]: https://.../compare/vOLD...HEAD
    //    or insert if missing.
    const repoSlug = "mattsears18/mattsears18.com";
    const unreleasedLink = `[Unreleased]: https://github.com/${repoSlug}/compare/v${newVersion}...HEAD`;
    const versionLink   = `[${newVersion}]: https://github.com/${repoSlug}/releases/tag/v${newVersion}`;

    const unreleasedLinkRe = /^\[Unreleased\]:.*$/m;
    if (unreleasedLinkRe.test(src)) {
      src = src.replace(unreleasedLinkRe, unreleasedLink);
    } else {
      src = src.replace(/\n*$/, `\n\n${unreleasedLink}\n`);
    }

    // Insert the new version link immediately after the Unreleased link.
    src = src.replace(unreleasedLink, `${unreleasedLink}\n${versionLink}`);

    fs.writeFileSync("CHANGELOG.md", src);
  ' "$new_version" "$today"
}

# ---------- main ----------

if [ "$#" -lt 1 ]; then
  die "missing argument — see: ./scripts/release.sh --help"
fi

case "${1:-}" in
  -h|--help)
    # Print only the leading header block (terminate at first blank line that
    # is NOT inside a comment).
    awk 'NR==1 {next} !/^#/ {exit} {sub(/^# ?/, ""); print}' "$0"
    exit 0
    ;;
esac

# Guard: tree must be clean. A dirty tree means uncommitted work the release
# would silently roll into the version-bump commit.
if [ -n "$(git status --porcelain)" ]; then
  die "working tree is dirty — commit or stash before releasing"
fi

# Guard: must be on the default branch. Releases off a feature branch are a
# recurring confused-tag failure mode.
DEFAULT_BRANCH="$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')"
DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]; then
  die "must be on '$DEFAULT_BRANCH' to release (currently on '$CURRENT_BRANCH')"
fi

# Ensure local default is up to date with remote — releasing off stale main
# means the tag points at a commit that isn't actually the latest.
git fetch --quiet origin "$DEFAULT_BRANCH"
LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse "origin/$DEFAULT_BRANCH")"
if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  die "local $DEFAULT_BRANCH is not aligned with origin — pull first"
fi

CURRENT_VERSION="$(read_pkg_version)"

if [ "$1" = "--bootstrap" ]; then
  # Tag the existing version without bumping. One-shot for the gap-fill case
  # where package.json already carries a version but no matching tag exists
  # (issue #35).
  NEW_VERSION="$CURRENT_VERSION"
  TAG_NAME="v${NEW_VERSION}"

  if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
    die "tag $TAG_NAME already exists locally — nothing to bootstrap"
  fi
  if git ls-remote --exit-code --tags origin "$TAG_NAME" >/dev/null 2>&1; then
    die "tag $TAG_NAME already exists on origin — nothing to bootstrap"
  fi

  echo "release: bootstrapping — tagging current HEAD ($LOCAL_SHA) as $TAG_NAME"
  git tag -a "$TAG_NAME" -m "Release $TAG_NAME"

  echo
  echo "Done locally. Push the tag with:"
  echo
  echo "    git push origin $TAG_NAME"
  echo
  echo "If you also want a GitHub Release page:"
  echo
  echo "    gh release create $TAG_NAME --notes-from-tag"
  echo
  exit 0
fi

NEW_VERSION="$(bump_semver "$CURRENT_VERSION" "$1")"
TAG_NAME="v${NEW_VERSION}"

if [ "$NEW_VERSION" = "$CURRENT_VERSION" ]; then
  die "new version ($NEW_VERSION) equals current version — refusing no-op release"
fi
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  die "tag $TAG_NAME already exists locally"
fi
if git ls-remote --exit-code --tags origin "$TAG_NAME" >/dev/null 2>&1; then
  die "tag $TAG_NAME already exists on origin"
fi

echo "release: $CURRENT_VERSION -> $NEW_VERSION (will create tag $TAG_NAME)"

write_pkg_version "$NEW_VERSION"
update_changelog "$NEW_VERSION"

git add package.json
[ -f CHANGELOG.md ] && git add CHANGELOG.md

git commit -m "chore(release): $TAG_NAME"
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"

echo
echo "Done locally. Push the commit and tag with:"
echo
echo "    git push origin $DEFAULT_BRANCH"
echo "    git push origin $TAG_NAME"
echo
echo "If you also want a GitHub Release page:"
echo
echo "    gh release create $TAG_NAME --notes-from-tag"
echo
