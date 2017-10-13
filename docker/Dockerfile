FROM node:8.6

RUN ["npm", "install", "-g", "serverless"]
RUN mkdir /var/app

COPY ./run.sh /
ENTRYPOINT [ "/run.sh" ]
