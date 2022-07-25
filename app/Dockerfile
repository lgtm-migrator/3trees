FROM zenika/alpine-chrome:102-with-node-16 as build
WORKDIR /app

# args
ARG GIT_TAG

# chrome
RUN apk -U --no-cache add git

# clone
RUN git clone -b $GIT_TAG https://github.com/3bases/3trees .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
RUN pnpm prune --prod
RUN rm -r cache

# main image
FROM zenika/alpine-chrome:102-with-node-16
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
