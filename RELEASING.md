# Releasing

Reproducible release flow for `mattsears18.com`. The release artifact is a **git tag** of the form `vX.Y.Z` pointing at a `chore(release):` commit on `main`. Tags are the canonical "what is this commit on production?" answer — `git describe --tags` falls back to "No tags found" without them, downstream tooling (release-please, semantic-release, GitHub Releases) can't anchor anything to a version, and rollbacks become guesswork.

This file is the source of truth for the convention. The mechanics live in [`scripts/release.sh`](./scripts/release.sh).

## Tag scheme

- **Format:** `vX.Y.Z` — leading `v`, three-part [SemVer](https://semver.org). Pre-releases use the standard form `v1.2.3-beta.1`.
- **Source of truth for the version number:** the `version` field in [`package.json`](./package.json). The script keeps the two aligned; if they ever drift, `package.json` wins and the next release re-syncs.
- **Annotated tags only.** `git tag -a` (not `git tag`). Annotation captures the date, author, and message — lightweight tags strip all three.
- **Tag message:** `Release vX.Y.Z`. Plain and parse-friendly.

The format aligns with the compare links already present at the bottom of [`CHANGELOG.md`](./CHANGELOG.md) (`compare/v0.1.0...HEAD`, `releases/tag/v0.1.0`). Don't change the `v` prefix without updating those.

## Bootstrap — first-time setup for an existing repo

This repo currently has `package.json` at `0.1.0` but no matching git tag (the gap [#35](https://github.com/mattsears18/mattsears18.com/issues/35) was filed to close). The bootstrap flow tags the current `main` HEAD with the existing version, **without** bumping or rewriting the CHANGELOG:

```bash
# From a clean main checkout, up to date with origin.
git checkout main
git pull --ff-only

./scripts/release.sh --bootstrap   # creates annotated tag v0.1.0 locally
```

The script prints the push commands when it finishes:

```bash
git push origin v0.1.0
# Optional — creates a GitHub Release page from the tag.
gh release create v0.1.0 --notes-from-tag
```

After the push, `git describe --tags` will return `v0.1.0` (plus a commit-count suffix if any commits have landed since), and downstream automation has an anchor to walk back from.

The bootstrap path is single-shot: the script refuses to run if a tag matching `package.json`'s version already exists locally or on origin.

## Cutting a release

For every subsequent release, the flow is:

```bash
# From a clean main checkout, up to date with origin.
git checkout main
git pull --ff-only

# Choose one. patch is the most common; minor and major follow SemVer rules.
./scripts/release.sh patch         # 0.1.0 -> 0.1.1
./scripts/release.sh minor         # 0.1.0 -> 0.2.0
./scripts/release.sh major         # 0.1.0 -> 1.0.0
./scripts/release.sh 0.2.0-rc.1    # explicit, for pre-releases
```

The script:

1. Verifies you're on `main` and the tree is clean.
2. Bumps `package.json`'s `version` field.
3. Promotes the `## [Unreleased]` block in `CHANGELOG.md` to `## [X.Y.Z] - <today>`, opens a fresh empty `## [Unreleased]` above it, and updates the compare/tag links at the bottom of the file.
4. Creates one commit: `chore(release): vX.Y.Z`.
5. Creates an annotated tag: `vX.Y.Z`.
6. Prints the push commands — **the script never pushes for you**. You push manually so a misfired script (or an agent) can't publish a tag the maintainer didn't sign off on.

Push when you're ready:

```bash
git push origin main
git push origin vX.Y.Z
gh release create vX.Y.Z --notes-from-tag   # optional — surfaces the tag on the Releases page
```

### Filling in the CHANGELOG before releasing

`scripts/release.sh` only moves the `[Unreleased]` header to `[X.Y.Z]`. It does **not** rewrite the content under that header. Edit `CHANGELOG.md` directly **before** running the release script — group entries under `### Added` / `### Changed` / `### Fixed` per [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

If you forget, the easiest recovery is:

```bash
# Undo locally (does NOT undo a pushed tag).
git tag -d vX.Y.Z
git reset --hard HEAD~1

# Edit CHANGELOG.md, then re-run.
./scripts/release.sh <kind>
```

If the tag was already pushed, prefer a `vX.Y.(Z+1)` patch release with the missing notes rather than rewriting history.

## Why not release-please / semantic-release?

The audit ([#35](https://github.com/mattsears18/mattsears18.com/issues/35)) called out both as candidates. We're deferring:

- **release-please** requires a GitHub App or a PAT with elevated permissions to write release PRs, and adds a `release-please-config.json` plus a `.release-please-manifest.json` to the repo root. Worth doing when the cadence justifies the per-release human time it would save — currently the manual flow is ~30 seconds and lands one commit + one tag.
- **semantic-release** assumes Conventional Commit titles map 1:1 to release type. The repo follows that convention, but cuts versions on human judgement (a `feat(blog):` doesn't always warrant a minor bump on a personal site). Automating the version choice would invert that.

Both stay open as a future improvement — file a follow-up issue if either becomes worth the integration cost.

## Common pitfalls

- **Forgot to push the tag.** `git push origin main` does NOT push tags by default. Push the tag explicitly: `git push origin vX.Y.Z`. (Don't use `git push --tags` — it'll push every local tag, including any experimental ones.)
- **Pushed a tag at the wrong commit.** Delete and recreate before anyone fetches it: `git tag -d vX.Y.Z && git push origin :refs/tags/vX.Y.Z`, then re-run the script. After fetchers have it, prefer a patch release instead.
- **CHANGELOG `[Unreleased]` is empty at release time.** Not an error per se — the version still tags. But the Releases page will be sparse. Fill it in before bumping.
- **Working off a feature branch.** The script refuses to release off anything other than `main`. If you intentionally want to tag a non-`main` commit (rare — usually a bugfix backport), do it by hand: `git tag -a vX.Y.Z -m "Release vX.Y.Z" <sha> && git push origin vX.Y.Z`.

## Acceptance criteria reference

This file and `scripts/release.sh` together satisfy the acceptance criteria in [#35](https://github.com/mattsears18/mattsears18.com/issues/35):

- Tagging `main` HEAD at `v0.1.0` is now a one-line command (`./scripts/release.sh --bootstrap`) — the maintainer runs it, not the agent.
- Future releases are tagged immediately after the version bump because the bump and the tag are the **same** command.
- `git describe --tags` will return a tag once the bootstrap tag is pushed.
