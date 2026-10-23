FROM node:24-bookworm-slim AS node
FROM ruby:3.3.12-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends build-essential git pkg-config libffi-dev libyaml-dev \
    && rm -rf /var/lib/apt/lists/*
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && gem install bundler -v 2.6.9 --no-document
WORKDIR /srv/jekyll
ENV BUNDLE_PATH=/usr/local/bundle
ENV BUNDLE_IGNORE_CONFIG=1
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 4000 4173
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--force_polling"]
