.PHONY: help
help:
	@echo "fast"
	@echo "  fast/test             ## runs ony fast tests"
	@echo ""
	@echo "all"
	@echo "  all/test              ## runs all tests"

.PHONY: fast/test
fast/test:
	cd ../ && ONLY_FAST=true node_modules/.bin/jest

.PHONY: all/test
all/test:
	cd ../ && node_modules/.bin/jest
