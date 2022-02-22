.PHONY: setup_mac_env clean generate build js-build

setup_mac_env:
	brew install bufbuild/buf/buf

clean:
	echo "clean"
	rm -rf ../packages/idl-ts/lib

generate:
	buf generate

js-build:
	cd ../../packages/idl-ts && yarn build

build:| clean generate js-build