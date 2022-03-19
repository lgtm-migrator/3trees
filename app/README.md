# Register

```bash
kubectl config use-context cloud_okteto_com --namespace 3trees-seonglae
kubectl create secret docker-registry ghcred \
--docker-server="ghcr.io" \
--docker-username="$USER" \
--docker-password="$TOKEN" \
--docker-email="$EMAIL"
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "ghcred"}]}'
kubectl create secret generic threetrees-secret --from-env-file=.env
```

# Deployment

change the image

```
kubectl config use-context cloud_okteto_com --namespace 3trees-seonglae
kubectl apply -f threetrees-svc.yaml
kubectl apply -f www.yaml
kubectl apply -f threetrees-deploy.yaml
```

# Local Build

```
GIT_TAG=`git describe --tags`
set -a; source .env; set +a
docker build  -t ghcr.io/3bases/3trees:$GIT_TAG \
--build-arg GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
--build-arg GCLOUD_PROJECT=$GCLOUD_PROJECT \
--build-arg FIREBASE_COLLECTION_IMAGES=$FIREBASE_COLLECTION_IMAGES \
--build-arg NOTION_API_AUTH_TOKEN=$NOTION_API_AUTH_TOKEN \
--build-arg GIT_TAG=$GIT_TAG \
.
docker push  ghcr.io/3bases/3trees:$GIT_TAG
docker tag ghcr.io/3bases/3trees:$GIT_TAG ghcr.io/3bases/3trees:latest
docker push  ghcr.io/3bases/3trees:latest
```
