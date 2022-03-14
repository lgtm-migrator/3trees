# Register

```bash
kubectl config use-context cloud_okteto_com
kubectl config set-context --current --namespace 3trees-seonglae
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
kubectl apply -f threetrees-deploy.yaml
```
