all:
	rm -rf lib
	coffee -o lib src
	coffee -c test/*.coffee

test:
	@@vows test/*.js

.PHONY: test
