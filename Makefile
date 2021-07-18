THEME_PATH := $(CURDIR)
export GHOST_PATH='/Users/toddbirchard/projects/ghostlocal'

define HELP
Manage development of hackersandslackers Ghost theme.

Usage:

make build           - Install all dependencies & build theme.
make dev             - Restart local ghost instant and compile site.
make clean           - Purge cache, locked, dependencies, logs, & lockfiles.
make update          - Update production dependencies to latest versions.
make reset           - Clean, update, and build site
endef
export HELP

.PHONY: build dev clean update reset help

all help:
	@echo "$$HELP"

.PHONY: build
build: clean
	gulp

.PHONY: dev
dev:
	cd $(GHOST_PATH) && ghost restart --verbose && cd $(THEME_PATH)
	gulp

.PHONY: clean
clean:
	find . -name 'package-lock.json' -delete
	find . -name 'yarn-error.log' -delete
	find . -wholename '*.lock' -delete
	find . -wholename '.yarn' -delete
	find . -wholename '**/node_modules' -delete
	find . -wholename '**/bower_components' -delete

.PHONY: update
update:
	npm install npm@latest -g
	npm install -g npm-check-updates@latest
	ncu -u --dep=prod
	yarn install

.PHONY: reset
reset: clean
	make update
	make build
