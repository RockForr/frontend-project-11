develop:
	sudo npx webpack serve

install:
	sudo npm ci

build:
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .