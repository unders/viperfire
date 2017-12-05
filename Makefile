.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## installs dependencis
	## install Typescript
	## brew install yarn --without-node
	## go get github.com/cortesi/modd/cmd/modd
	## npm install -g firebase-tools
	cd functions && yarn install
	npm install

.PHONY: start
start: ## starts dev environment
	@modd -f support/modd.conf

.PHONY: test
test: ## runs tests
	node_modules/.bin/jest

.PHONY: dist
dist: ## creates a release
	@cp support/config.env.prod.ts functions/src/shared/config/env.ts
	@rsync -avz --delete functions/src/shared/ src/shared/
	@rm -rf dist/assets
	@node_modules/.bin/node-sass --output-style compressed --output ./dist/assets/css ./sass
	@node_modules/.bin/webpack --config support/webpack.dev.config.js
	@node_modules/.bin/webpack --config support/webpack.prod.config.js
	@rm -rf functions/build
	@cd functions && tsc
	@rsync -avz --delete --exclude 'assets/css' --exclude 'assets/js' public/ dist/
	@./bin/hasher.sh
	@cp support/config.env.dev.ts functions/src/shared/config/env.ts

.PHONY: stag-deploy
stag-deploy: dist ## deploys app to viperfire-stag
	firebase use viperfire-stag
	@cp support/firebase.prod.json firebase.json
	firebase deploy --public dist
	@cp support/firebase.dev.json firebase.json

.PHONY: prod-deploy
prod-deploy: dist ## deploys app firebase: viperfire-prod
	@#firebase use viperfire-prod
	@cp support/firebase.prod.json firebase.json
	@./bin/deploy.sh
	@#firebase use viperfire-prod
	@cp support/firebase.dev.json firebase.json

.PHONY: list
list: ## shows firebase projects
	firebase list

.PHONY: help-closure
help-closure: ## shows closure compiler options
	java -jar  node_modules/google-closure-compiler/compiler.jar --help

.PHONY: tree
tree: ## lists the projects file structure
	tree -I 'dist|node_modules|build|public|deploy'

.PHONY: stag-log
stag-log: ## show staging log
	@firebase use viperfire-stag
	@firebase functions:log --only appV1,createUserProfile

.PHONY: log
log: ## show git log
	@git log --graph --oneline --decorate

