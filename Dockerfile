FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /playwright/

COPY package.json ./

RUN corepack enable
RUN yarn install
RUN yarn setup

COPY . .

ENTRYPOINT [ "/bin/bash", "-l", "-c" ]
