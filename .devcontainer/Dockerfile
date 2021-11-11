FROM node:16

RUN apt update
RUN apt upgrade -y
# node에 반드시 필요한 것은 아니나, 자주 사용되기에 추가함
RUN apt install -y jq tree libc6-dev gcc g++ libncurses5-dev libstdc++6 build-essential vim

# global로 설치하면 프로세스 로딩이 빠르다. jest에 특히 필요하다
RUN npm i -g nodemon npm-run-all prettier prettier-plugin-sh jest serve

# docker 설치, docker cli만 사용하기 때문에 아래처럼 간단하게 했다.
RUN DOCKER_PKG="docker-20.10.1.tgz";\
    curl -fsSLO --compressed "https://download.docker.com/linux/static/stable/x86_64/$DOCKER_PKG"; \
    tar -xf $DOCKER_PKG --strip-components 1 --directory /usr/local/bin/ docker/docker; \
    rm -f $DOCKER_PKG

# color prompt
RUN echo 'PS1="\[\033[32m\]\w\[\033[00m\] "' >> ~/.bashrc
RUN echo "alias ls='ls --color=auto'" >> ~/.bashrc
RUN echo "alias l='ls --color=auto -lA'" >> ~/.bashrc
