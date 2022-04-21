FROM node:lts-alpine as build
WORKDIR /app

# args
ARG GIT_TAG

# chrome
RUN set -e \
  && echo " ------ INSTALLING PACKAGES ------" \
    && apk -U --no-cache add udev chromium xvfb dbus ttf-freefont bash git \
  \
  && echo " ------ SETTING UP CHROMIUM ------" \
    && rm -f /usr/bin/chromium-browser \
    && ln -s /usr/bin/xvfb-chromium /usr/bin/google-chrome \
    && ln -s /usr/bin/xvfb-chromium /usr/bin/chromium-browser \
    && chmod 755 /usr/bin/xvfb-chromium \
  \
  && echo " ------ CLEANING UP ------" \
    && rm -rf /var/cache/apk/*

# clone
RUN git clone -b $GIT_TAG https://github.com/3bases/3trees .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm build
RUN pnpm i --prod
RUN rm -r cache

# main image
FROM node:lts-alpine
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
