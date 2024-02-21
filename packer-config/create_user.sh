#!/bin/bash


# sudo unzip webapp.zip -d /opt/webapp
# sudo groupadd csye6225
# sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

# sudo chown -R csye6225:csye6225 /opt/webapp
# sudo chmod -R 755 /opt/webapp

# cd /opt/webapp/
# sudo npm install


sudo unzip webapp.zip -d /opt/webapp
cd /opt/webapp/
sudo npm install
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 750 /opt/webapp