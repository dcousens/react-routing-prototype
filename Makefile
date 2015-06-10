.PHONY: all build-www build-js build-less clean watch-www watch-js watch-less serve

BROWSERIFY=node_modules/.bin/browserify
WATCHIFY=node_modules/.bin/watchify
LESSC=node_modules/.bin/lessc

all: watch

build: build-www build-js build-less

build-www: www/index.html

www/index.html: src/index.html
	mkdir -p www/
	cp src/index.html www/index.html

build-js: node_modules www/js/react.js
	mkdir -p www/js
	$(BROWSERIFY) src/js/app.js \
		--external react \
		--external react/addons \
		--transform babelify \
		--transform brfs \
		--outfile www/js/app.js \
		--debug

www/js/react.js: node_modules
	mkdir -p www/js
	$(BROWSERIFY) \
		--require react \
		--require react/addons \
		--outfile www/js/react.js

build-less: www/css/app.css

www/css/app.css: node_modules src/css/app.less
	mkdir -p www/css
	lessc src/css/app.less > www/css/app.css

clean:
	rm -rf www/

node_modules:
	npm install

#################

watch-www: build-www
	while true; do \
		inotifywait -e modify src/index.html; \
		make build-www; \
	done

watch-js: node_modules www/js/react.js
	mkdir -p www/js
	$(WATCHIFY) src/js/app.js \
		--external react \
		--external react/addons \
		--transform babelify \
		--transform brfs \
		--outfile www/js/app.js \
		--debug -v

watch-less: build-less node_modules
	while true; do \
		inotifywait -e modify src/css/*.less; \
		make build-less; \
	done

serve:
	mkdir -p www
	cd www/ && python2.7 -m SimpleHTTPServer

watch: clean
	make -j4 watch-www watch-js watch-less serve
