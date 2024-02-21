#!/bin/bash

#Install MySQL

sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

#Create database and user
# sudo mysql -u root -e "CREATE DATABASE db;"
# sudo mysql -u root -e "CREATE USER 'clouduser'@'localhost' IDENTIFIED BY 'dbpass';"
# sudo mysql -u root -e "GRANT ALL PRIVILEGES ON db.* TO 'clouduser'@'localhost';"

sudo mysql -u root -e "CREATE DATABASE $DB;"
sudo mysql -u root -e "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON $DB.* TO '$DB_USER'@'localhost';"

#Install node dependencies
sudo dnf module list nodejs
sudo dnf module enable -y nodejs:20
sudo dnf install -y npm
sudo yum install zip unzip -y


