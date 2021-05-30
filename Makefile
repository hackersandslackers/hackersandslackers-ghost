THEME_PATH := $(CURDIR)
export GHOST_PATH='/Users/toddbirchard/projects/ghosttheme-stockholm'

define HELP
Compile & manage hackersandslackers Ghost theme.

Usage:

make build           - Install all dependencies & build theme.
make dev             - Build & compile site.
make fix             - Fix security vulnerabilities.
make clean           - Purge cache & dependencies, logs, & lockfiles.
make update          - Update npm production dependencies.
endef
export HELP

.PHONY: build install fix clean update help

all help:
	@echo "$$HELP"

.PHONY: build
build: clean
	gulp

.PHONY: dev
dev: build
	cd $(GHOST_PATH) && ghost restart --verbose && cd $(THEME_PATH)


.PHONY: clean
clean:
	find . -name 'package-lock.json' -delete
	find . -name 'yarn.lock' -delete
	find . -wholename '.yarn' -delete
	find . -wholename '**/node_modules' -delete

.PHONY: reset
reset: clean
	npm i
	npm audit fix

.PHONY: update
update:
	ncu -u --dep=prod
	npm i
	npm audit fix
