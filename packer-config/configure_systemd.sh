#!/bin/bash

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl restart webapp
sudo systemctl stop webapp