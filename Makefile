.PHONY: help setup install dev build start lint typecheck format format-check verify clean release release-bootstrap

# Default target: print available targets.
help:
	@echo "Available targets:"
	@echo "  setup             Install dependencies (npm ci — clean, lockfile-driven)"
	@echo "  install           Alias for setup"
	@echo "  dev               Start the Next.js dev server on port 3000"
	@echo "  build             Production build (next build)"
	@echo "  start             Serve the production build locally"
	@echo "  lint              ESLint via flat config"
	@echo "  typecheck         Run tsc --noEmit"
	@echo "  format            Prettier write across the repo"
	@echo "  format-check      Prettier check (no writes)"
	@echo "  verify            lint + typecheck + build (matches CI)"
	@echo "  release           Cut a release — bumps version, updates CHANGELOG, tags."
	@echo "                    Requires KIND=patch|minor|major|X.Y.Z. See RELEASING.md."
	@echo "  release-bootstrap First-time tag of current main HEAD at package.json's version"
	@echo "  clean             Remove build artifacts and node_modules"

setup:
	npm ci

install: setup

dev:
	npm run dev

build:
	npm run build

start:
	npm start

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

format:
	npm run format

format-check:
	npm run format:check

# Canonical "is this checkout green?" — mirrors .github/workflows/ci.yml.
verify: lint typecheck build

# Cut a release. Pass KIND=patch|minor|major|<explicit-version>:
#   make release KIND=patch    # 0.1.0 -> 0.1.1
#   make release KIND=minor    # 0.1.0 -> 0.2.0
#   make release KIND=0.2.0-rc.1
# See RELEASING.md for the full flow. The script prints push commands when done —
# it never pushes for you.
release:
	@if [ -z "$(KIND)" ]; then \
		echo "release: pass KIND=patch|minor|major|X.Y.Z (see RELEASING.md)"; \
		exit 2; \
	fi
	./scripts/release.sh $(KIND)

# First-time tag of current main HEAD at package.json's existing version,
# without bumping. One-shot for issue #35 — see RELEASING.md.
release-bootstrap:
	./scripts/release.sh --bootstrap

clean:
	rm -rf .next out node_modules
