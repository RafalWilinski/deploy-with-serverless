FROM node:8.6

RUN ["npm", "install", "-g", "serverless"]

ADD ./run.sh
