#!/bin/bash

# Install MySQL
sudo yum install -y unzip
sudo unzip /tmp/webapp.zip -d /
# sudo yum install -y wget
# sudo wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm
# sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql
sudo rpm -Uvh mysql80-community-release-el8-1.noarch.rpm
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Create MySQL database and user
sudo mysql -u root -e "CREATE DATABASE db;"
sudo mysql -u root -e "CREATE USER 'clouduser'@'localhost' IDENTIFIED BY 'dbpass';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON db.* TO 'clouduser'@'localhost';"


sudo dnf module list nodejs
sudo dnf module enable -y nodejs:20
sudo dnf install -y npm
