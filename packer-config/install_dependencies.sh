#!/bin/bash

#Install MySQL

sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

#Create database and user
sudo mysql -u root -e "CREATE DATABASE db;"
sudo mysql -u root -e "CREATE USER 'clouduser'@'localhost' IDENTIFIED BY 'dbpass';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON db.* TO 'clouduser'@'localhost';"

#Install node dependencies
sudo dnf module list nodejs
sudo dnf module enable -y nodejs:20
sudo dnf install -y npm
sudo yum install zip unzip -y

sudo unzip webapp.zip -d /opt/webapp
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp

cd /opt/webapp/
sudo npm install
