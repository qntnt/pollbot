.PHONY: setup_mac_env clean generate build

setup_mac_env:
	brew install bufbuild/buf/buf

clean:
	echo "clean"
	rm -rf ../packages/idl-ts/lib

generate:
	buf generate

build:| clean generate