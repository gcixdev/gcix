FROM alpine:3 as base

WORKDIR /usr/src/gcix

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

RUN addgroup gcix && adduser -D -G gcix gcix

COPY --chown=gcix:gcix dist dist
COPY --chown=gcix:gcix docs docs
COPY --chown=gcix:gcix docker docker
COPY --chown=gcix:gcix lib lib
COPY --chown=gcix:gcix src src
COPY --chown=gcix:gcix LICENSE .
COPY --chown=gcix:gcix CHANGELOG.md .
COPY --chown=gcix:gcix README.md .
COPY --chown=gcix:gcix CODE_OF_CONDUCT.md .
COPY --chown=gcix:gcix package.json .
COPY --chown=gcix:gcix yarn.lock .

ENTRYPOINT [ "/usr/src/gcix/docker/gcix.sh" ]

FROM base as ts

RUN apk update && apk add nodejs npm && rm -rf /var/cache/apk/*

USER gcix
WORKDIR /home/gcix

ENV PATH="/home/gcix/node_modules/.bin:${PATH}"
RUN npm install ts-node /usr/src/gcix/dist/js/gcix@*.tgz

FROM base as py

RUN apk update && apk add nodejs python3 py3-pip && rm -rf /var/cache/apk/*

WORKDIR /home/gcix
USER gcix

RUN python3 -m venv "/home/gcix/venv" && \
  . "/home/gcix/venv/bin/activate" && \
  pip3 install $(find "/usr/src/gcix/dist/python" -type f -iname '*.whl')
