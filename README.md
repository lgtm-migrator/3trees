# Three Trees

![image](https://user-images.githubusercontent.com/27716524/126918573-c8c824bc-70eb-4c8c-ab72-93867451394a.png)



## Philosophy

- Atomic Design Pattern
- Minimalism


## Made by
- Next js
- Windi CSS
- React Notion X
- React Three Fiber
- React Spring


## Build
```bash
VERSION=0.1.0
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

### Local
```bash
VERSION=2.1.1
docker-compose build
```



## Reference

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
