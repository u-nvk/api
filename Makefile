build_docker:
	docker image build --platform linux/amd64 -t ermolaev10/unvk-api:$(TAG) .
