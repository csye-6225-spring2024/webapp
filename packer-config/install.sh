#!/bin/bash

# Install MySQL
# sudo yum install -y unzip
# sudo unzip /tmp/webapp.zip -d /
# sudo yum install -y wget
# sudo wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm
# sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql
# sudo rpm -Uvh mysql80-community-release-el8-1.noarch.rpm
# sudo yum install -y mysql-server
# sudo systemctl start mysqld
# sudo systemctl enable mysqld

# # Create MySQL database and user
# sudo mysql -u root -e "CREATE DATABASE db;"
# sudo mysql -u root -e "CREATE USER 'clouduser'@'localhost' IDENTIFIED BY 'dbpass';"
# sudo mysql -u root -e "GRANT ALL PRIVILEGES ON db.* TO 'clouduser'@'localhost';"


# Install Node.js and npm
sudo dnf module list nodejs
sudo dnf module enable -y nodejs:20
sudo dnf install -y npm

# Create local user csye6225 and its group
sudo groupadd csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

# Create directory for the application
sudo mkdir -p /opt/my-app

# Copy application artifacts and configuration files
sudo cp -r /Anusha_Senthilnathan_002825929_03/* /opt/my-app
sudo chown -R csye6225:csye6225 /opt/my-app


cd /opt/my-app/webapp
sudo npm install


# Add systemd service fil/etc/systemd/system/e
# sudo cp /Users/anushasenthilnathan/Desktop/Anusha_Senthilnathan_002825929_03/webapp/webapp.service /opt/my-app
# sudo systemctl daemon-reload
# sudo systemctl enable my-app
