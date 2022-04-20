# Register

```bash
kubectl config set-context cloud_okteto_com --namespace 3trees-seonglae
kubectl config use-context cloud_okteto_com
kubectl create secret docker-registry ghcred \
--docker-server="ghcr.io" \
--docker-username="$USER" \
--docker-password="$TOKEN" \
--docker-email="$EMAIL"
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "ghcred"}]}'
kubectl create secret generic threetrees-secret --from-env-file=.env
cat ~/.kube/config | base64 > KUBE_CONFIG
```

# Deployment

change the image of deploy manifest

```
kubectl config set-context cloud_okteto_com --namespace 3trees-seonglae
kubectl config use-context cloud_okteto_com
kubectl apply -f threetrees-svc.yaml
kubectl apply -f threetrees-deploy.yaml
```

# Test

change the image of deploy manifest

```
kubectl config set-context cloud_okteto_com --namespace 3trees-seonglae
kubectl config use-context cloud_okteto_com
kubectl apply -f test-svc.yaml
kubectl apply -f test-deploy.yaml
```

# Local Build

```
GIT_TAG=`git describe --tags`
set -a; source .env; set +a
docker build  -t ghcr.io/3bases/3trees:$GIT_TAG \
--build-arg GIT_TAG=$GIT_TAG \
.
docker push  ghcr.io/3bases/3trees:$GIT_TAG
docker tag ghcr.io/3bases/3trees:$GIT_TAG ghcr.io/3bases/3trees:latest
docker push  ghcr.io/3bases/3trees:latest
```
