FROM jekyll/jekyll:latest
LABEL maintainer=tkunch@rebbix.com

ENV ROOT_DIR="/build"

RUN mkdir -p $ROOT_DIR
WORKDIR $ROOT_DIR

COPY . .

EXPOSE 4000

CMD ["jekyll" "serve"]
