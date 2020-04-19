#!/bin/sh
sudo docker build -t <%= dockerRegistryPrefix %><%= name %>:latest .
sudo docker push <%= dockerRegistryPrefix %><%= name %>:latest
