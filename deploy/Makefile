PROD-PROJECT := viperfire-prod
STAG-PROJECT := viperfire-stag

.PHONY: help
help:
	@echo "Staging"
	@echo "  stag/deploy           ## deploy to firebase project: $(STAG-PROJECT)"
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

.PHONY: stag/check
stag/check:
	curl -i https://$(STAG-PROJECT).firebaseapp.com/
	curl -i https://$(STAG-PROJECT).firebaseapp.com/404-not-there
	curl -i https://$(STAG-PROJECT).firebaseapp.com/deployed-version.txt

.PHONY: stag/version
stag/version:
	curl https://$(STAG-PROJECT).firebaseapp.com/deployed-version.txt


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
	curl -i https://$(PROD-PROJECT).firebaseapp.com/
	curl -i https://$(PROD-PROJECT).firebaseapp.com/404-not-there
	curl -i https://$(PROD-PROJECT).firebaseapp.com/deployed-version.txt

.PHONY: prod/version
prod/version:
	curl https://$(PROD-PROJECT).firebaseapp.com/deployed-version.txt


.PHONY: prod/log
prod/log:
	@firebase use $(PROD_PROJECT)
	@firebase functions:log --only appV1,createUserProfile
