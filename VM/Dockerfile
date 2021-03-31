FROM golang:latest
ENV GOPATH=/app
ENV PATH=$GOPATH/bin:$PATH
RUN export THETA_HOME=$GOPATH/src/github.com/thetatoken/theta
RUN apt-get update
RUN apt-get install python3 python3-paho-mqtt -y
WORKDIR /app/src/github.com/thetatoken/theta
COPY . .
RUN export GO111MODULE=on
RUN make install
RUN cp -r ./integration/privatenet ../privatenet
RUN mkdir ~/.thetacli
RUN cp -r ./integration/privatenet/thetacli/* ~/.thetacli/
RUN chmod 700 ~/.thetacli/keys/encrypted
EXPOSE 28888
CMD bash theta_start.sh
