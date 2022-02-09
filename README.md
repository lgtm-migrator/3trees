# Three Trees
![image](https://user-images.githubusercontent.com/27716524/153128771-d735ff69-5c0f-4077-8fdf-08e5adb35f81.png)



# How to Contribute

## Made by
- Next js
- Windi CSS
- React Notion X
- React Three Fiber
- React Spring

## Philosophy

- Atomic Design Pattern
- Minimalism

### [Code Structure](https://app.codesee.io/maps/c7512230-8968-11ec-b3c9-e762effaaa2a)
![image](https://user-images.githubusercontent.com/27716524/153128046-8fce8e3f-a412-4d04-9f6c-27f4aee3662e.png)





## Docker Build
```bash
VERSION=2.1.1
set -a; source .env; set +a
docker build  -t ghcr.io/3bases/3trees:$VERSION \
--build-arg GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
--build-arg GCLOUD_PROJECT=$GCLOUD_PROJECT \
--build-arg FIREBASE_COLLECTION_IMAGES=$FIREBASE_COLLECTION_IMAGES \
--build-arg NOTION_API_AUTH_TOKEN=$NOTION_API_AUTH_TOKEN \
.
docker push  ghcr.io/3bases/3trees:$VERSION
docker tag ghcr.io/3bases/3trees:$VERSION ghcr.io/3bases/3trees:latest
docker push  ghcr.io/3bases/3trees:latest

# deploy
okteto namespace
# deploy to current cluster
okteto stack deploy --wait
# if windows, change to default
kubectl config use-context docker-desktop
```

### Docker Local
```bash
VERSION=2.1.1
docker-compose build
```



## Reference

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
