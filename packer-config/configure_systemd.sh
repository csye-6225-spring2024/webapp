#!/bin/bash
 
 
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
 
sudo chown csye6225:csye6225 /etc/systemd/system/webapp.service
 
sudo chmod 750 /etc/systemd/system/webapp.service
sudo chown -R csye6225:csye6225 /opt/
sudo chmod -R 750 /opt/webapp
 
 
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl restart webapp