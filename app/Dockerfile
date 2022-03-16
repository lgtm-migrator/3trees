FROM node:16-alpine as build
WORKDIR /app

# args
ARG GOOGLE_APPLICATION_CREDENTIALS
ARG GCLOUD_PROJECT
ARG FIREBASE_COLLECTION_IMAGES
ARG NOTION_API_AUTH_TOKEN
ARG GIT_TAG

# clone
RUN apk --no-cache --virtual build-dependencies add git
RUN git clone -b $GIT_TAG https://$GIT_TOKEN@github.com/3bases/3trees .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
RUN pnpm i --prod

# main image
FROM node:16-alpine
COPY --from=build /app /app
WORKDIR /app
RUN npm i -g pnpm

# make user
RUN adduser threetrees -D -H
RUN chown -R threetrees /app
USER threetrees

# meta
EXPOSE 1234
CMD [ "pnpm", "start" ]
