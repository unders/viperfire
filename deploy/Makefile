PROD-PROJECT := viperfire-prod
PROD-SITE := https://$(PROD-PROJECT).firebaseapp.com
STAG-PROJECT := viperfire-stag
STAG-SITE := https://$(STAG-PROJECT).firebaseapp.com

.PHONY: help
help:
	@echo "Staging"
	@echo "  stag/deploy           ## deploy to firebase project: $(STAG-PROJECT)"
	@echo "  stag/deploy/index     ## deployed only index"
	@echo "  stag/check            ## check deployment"
	@echo "  stag/version          ## check deployed version"
	@echo "  stag/log              ## show log"
	@echo ""
	@echo "Production"
	@echo "  prod/deploy           ## deploy to firebase project: $(PROD-PROJECT)"
	@echo "  prod/check            ## check deployment"
	@echo "  prod/version          ## check deployed version"
	@echo "  prod/log              ## show log"

##
## STAG
##

.PHONY: stag/deploy
stag/deploy:
	@firebase use $(STAG-PROJECT)
	@firebase deploy

.PHONY: stag/deploy/index
stag/deploy/index:
	@firebase use $(STAG-PROJECT)
	@firebase deploy --only firestore:indexes

.PHONY: stag/check
stag/check:
	curl -i $(STAG-SITE)/
	curl -i $(STAG-SITE)/404-not-there
	curl -i $(STAG-SITE)/deployed-version.txt

.PHONY: stag/version
stag/version:
	curl $(STAG-SITE)/deployed-version.txt

.PHONY: stag/log
stag/log:
	@firebase use $(STAG_PROJECT)
	@firebase functions:log --only appV1,createUserProfile



##
## PROD
##

.PHONY: prod/deploy
prod/deploy:
	#@firebase use $(PROD-PROJECT)
	@./bin/deploy.sh

.PHONY: prod/check
prod/check:
	curl -i $(PROD-SITE)/
	curl -i $(PROD-SITE)/404-not-there
	curl -i $(PROD-SITE)/deployed-version.txt

.PHONY: prod/version
prod/version:
	curl $(PROD-SITE)/deployed-version.txt

.PHONY: prod/log
prod/log:
	@firebase use $(PROD_PROJECT)
	@firebase functions:log --only appV1,createUserProfile
