FROM node:16

RUN apt update
RUN apt upgrade -y

# node에 반드시 필요한 것은 아니나, 자주 사용되기에 추가함
RUN apt install -y jq tree vim asciinema
# ApacheBench
RUN apt install -y apache2-utils

# docker 설치, docker cli만 사용하기 때문에 아래처럼 간단하게 했다.
RUN DOCKER_PKG="docker-20.10.1.tgz";\
    curl -fsSLO --compressed "https://download.docker.com/linux/static/stable/$(arch)/$DOCKER_PKG"; \
    tar -xf $DOCKER_PKG --strip-components 1 --directory /usr/local/bin/ docker/docker; \
    rm -f $DOCKER_PKG

# color prompt
RUN echo 'PS1="\[\033[32m\]\w\[\033[00m\] "' >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias l='ls --color=auto -lA'" >> ~/.bashrc

ENV NODE_ENV=development
