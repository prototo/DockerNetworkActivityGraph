#!/bin/bash

# the output format for httpry
# reference https://github.com/jbittel/httpry/blob/master/doc/format-string
FORMAT_STRING="source-ip,source-port,direction,dest-ip,dest-port,method,request-uri,status-code";

# remove any old runner scripts, that may contain incalid interfaces
rm ./httpry_runner.sh;

# generate an httpry line for each available interface
# we run an instance for each interface in background to get all interface logs at the same time
for INTERFACE in `ifconfig | sed 's/\s.*//'`;
do echo "httpry -i $INTERFACE -f $FORMAT_STRING \"not port 4001 and not port 3000\" &" >> httpry_runner.sh;
done;

# run the runner!
sh ./httpry_runner.sh;
