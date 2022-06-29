FROM node:16-alpine as build
WORKDIR /app

# args
ARG GIT_TAG

# chrome
RUN apk -U --no-cache add udev chromium git
RUN ln -s /usr/bin/chromium-browser /usr/bin/google-chrome

# clone
RUN git clone -b $GIT_TAG https://github.com/3bases/3trees .
RUN rm -r .git

# install
RUN npm i -g pnpm
RUN PUPPETEER_PRODUCT=chrome pnpm i
RUN pnpm build
RUN pnpm i --prod
RUN rm -r cache

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
