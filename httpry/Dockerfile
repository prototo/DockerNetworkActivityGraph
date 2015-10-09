FROM ubuntu

ADD ./app /app
WORKDIR /app
RUN apt-get update && apt-get -y install httpry

CMD sh run.sh && bash -c "while true; do sleep 1; done"
