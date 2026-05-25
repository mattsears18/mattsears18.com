.PHONY: help setup install dev build start lint typecheck format format-check verify clean

# Default target: print available targets.
help:
	@echo "Available targets:"
	@echo "  setup         Install dependencies (npm ci — clean, lockfile-driven)"
	@echo "  install       Alias for setup"
	@echo "  dev           Start the Next.js dev server on port 3000"
	@echo "  build         Production build (next build)"
	@echo "  start         Serve the production build locally"
	@echo "  lint          ESLint via flat config"
	@echo "  typecheck     Run tsc --noEmit"
	@echo "  format        Prettier write across the repo"
	@echo "  format-check  Prettier check (no writes)"
	@echo "  verify        lint + typecheck + build (matches CI)"
	@echo "  clean         Remove build artifacts and node_modules"

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

clean:
	rm -rf .next out node_modules
