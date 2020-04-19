#!/bin/sh
sudo docker build -t <%= dockerRegistryPrefix %><%= dockerContainerName %>:latest .
sudo docker push <%= dockerRegistryPrefix %><%= dockerContainerName %>:latest
