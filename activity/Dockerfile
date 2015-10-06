FROM opennsm/tcpdump

CMD tcpdump -K -q -t -nn -N -i any not port 3000 and not port 22 and not port 4001
