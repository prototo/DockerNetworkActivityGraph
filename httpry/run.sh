#!/bin/bash
sh build.sh;
docker run -d --net=host --name=httpry httpry;
