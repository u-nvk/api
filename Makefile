build_docker:
	docker image build --platform linux/amd64 -t ermolaev10/unvk-api:$(TAG) .

build_docker_latest_dev:
	docker image build --platform linux/amd64 -t ermolaev10/unvk-api:latest-dev .

build_docker_latest_dev_and_push:
	docker image build --platform linux/amd64 -t ermolaev10/unvk-api:latest-dev .
	docker push ermolaev10/unvk-api:latest-dev
