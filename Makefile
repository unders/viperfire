GITTAG :=v0.0.7
BUILDSTAMP :=$(shell date -u '+%Y-%m-%dT%I:%M%p')
GITHASH :=$(shell git rev-parse HEAD)

VERSION := deploy/support/deployed-version.txt
PREVIOUS := deploy/support/deployed-previous.txt
DEPLOYED_VERSION := deploy/public/deployed-version.txt

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## installs dependencis
	## install nvm - https://github.com/creationix/nvm
	## nvm install 6.11.5
	## npm uninstall -g @google-cloud/functions-emulator
	## npm install -g @google-cloud/functions-emulator
	## brew install yarn --without-node
	## go get github.com/cortesi/modd/cmd/modd
	## npm install -g typescript
	## npm install -g firebase-tools
	## npm install -g postcss
	## npm install -g postcss-cli autoprefixer
	cd functions && yarn install
	npm install

.PHONY: start
start: ## starts dev environment
	@modd -f support/modd.conf

.PHONY: release
release: ## creates a release
	##
	## Build Client
	##
	@rm -rf src/shared
	@cp support/config.env.prod.ts functions/src/shared/config/env.ts
	@rsync -avz --delete functions/src/shared/ src/shared/
	@rm -rf deploy/public/
	@rsync -avz --delete --exclude 'assets/css' --exclude 'assets/js' public/ deploy/public
	@node_modules/.bin/node-sass --output-style compressed --output ./deploy/public/assets/css ./sass
	@postcss --use autoprefixer -r deploy/public/assets/css/main.css
	@cp sass/css/reset.css deploy/public/assets/css/reset.css
	@node_modules/.bin/webpack --config support/webpack.dev.config.js
	@node_modules/.bin/webpack --config support/webpack.prod.config.js
	@cp $(VERSION) $(PREVIOUS)
	@echo tag:$(GITTAG) time:$(BUILDSTAMP) githash:$(GITHASH) > $(VERSION)
	@cp $(VERSION) $(DEPLOYED_VERSION)
	##
	## Build functions
	##
	@rm -rf deploy/functions/src
	@rm -rf deploy/functions/build
	@rm -rf deploy/functions/node_modules
	@cp functions/package.json deploy/functions/package.json
	@cp functions/tsconfig.json deploy/functions/tsconfig.json
	@cp functions/yarn.lock deploy/functions/yarn.lock
	@rsync -avz --delete functions/src/ deploy/functions/src
	@cp support/config.env.dev.ts functions/src/shared/config/env.ts
	##
	## Fingerprint assets
	##
	@./bin/hasher.sh
	@cd deploy/functions && yarn install && tsc

.PHONY: list
list: ## shows firebase projects
	firebase list

.PHONY: help-closure
help-closure: ## shows closure compiler options
	java -jar  node_modules/google-closure-compiler/compiler.jar --help

.PHONY: tree
tree: ## lists the projects file structure
	tree -I 'node_modules|build|public|deploy'


.PHONY: log
log: ## show git log
	@git log --graph --oneline --decorate

