FROM node:8.6

RUN apt-get update && \
    apt-get upgrade -y

RUN apt-get install -y \
  less \
  man \
  python \
  python-pip \
  python-dev \
  python-yaml

RUN pip install awscli
RUN echo "export PATH=~/.local/bin:$PATH" > ~/.bashrc
RUN ["npm", "install", "-g", "serverless"]

COPY ./run.sh /
COPY ./change-deployment-bucket.py /
ENTRYPOINT [ "/run.sh" ]
