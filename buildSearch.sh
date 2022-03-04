#!/bin/sh

cd ../se-frontend
npm run build
rm -r ../EsSearchEngine/searching-service/src/main/resources/web
mv build ../EsSearchEngine/searching-service/src/main/resources/web
cd ../EsSearchEngine
./gradlew -p searching-service check && ./gradlew -p searching-service -Penv=dev docker
cd build/searching-service/docker
docker build -t "jordanleeeee/search-service:$1" .
docker push "jordanleeeee/search-service:$1"
