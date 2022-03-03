#!/bin/sh

cd ../se-frontend
npm run build
rm -r ../SearchEngineV2/searching-service/src/main/resources/web
mv build ../SearchEngineV2/searching-service/src/main/resources/web
cd ../SearchEngineV2
./gradlew -p searching-service check && ./gradlew -p searching-service -Penv=dev docker
cd build/searching-service/docker
docker build -t "jordanleeeee/search-service:$1" .
docker push "jordanleeeee/search-service:$1"
