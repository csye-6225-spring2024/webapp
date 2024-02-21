#!/bin/bash

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

sudo chown csye6225:csye6225 /etc/systemd/system/webapp.service
sudo chmod 750 /etc/systemd/system/webapp.service
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/webapp


sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
sudo systemctl daemon-reload
#sudo systemctl restart webapp
# sudo systemctl stop webapp