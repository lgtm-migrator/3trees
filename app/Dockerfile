FROM node:16-buster-slim as build
WORKDIR /app

# make user
RUN adduser threetrees && chown -R threetrees /app
USER threetrees

# args
ARG GOOGLE_APPLICATION_CREDENTIALS
ARG GCLOUD_PROJECT
ARG FIREBASE_COLLECTION_IMAGES
ARG NOTION_API_AUTH_TOKEN
ARG GIT_TAG

# clone
RUN apt install git
RUN git clone -b $VERSION https://$GIT_TOKEN@github.com/3bases/3trees .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN pnpm i --prod
RUN pnpm build

# main image
FROM node:16-alpine
COPY --from=build /app /app
WORKDIR /app
RUN npm i -g pnpm
EXPOSE 8888

CMD [ "pnpm", "start" ]
