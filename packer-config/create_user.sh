#!/bin/bash


# sudo unzip webapp.zip -d /opt/webapp
# sudo groupadd csye6225
# sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225

# sudo chown -R csye6225:csye6225 /opt/webapp
# sudo chmod -R 755 /opt/webapp

# cd /opt/webapp/
# sudo npm install


# sudo unzip webapp.zip -d /opt/webapp
# cd /opt/webapp/
# sudo npm install
# sudo groupadd csye6225
# sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225
# sudo chown -R csye6225:csye6225 /opt/webapp
# sudo chmod -R 750 /opt/webapp

#!/bin/bash
# Install unzip
sudo yum install -y unzip

# Check if the directory /opt/csye6225home/ exists, if not, create it
if [ ! -d "/opt/csye6225/" ]; then
    sudo mkdir -p /opt/csye6225/webapp
fi

# Move webapp.zip and install node modules
sudo mv /tmp/webapp.zip /opt/csye6225/webapp
cd /opt/csye6225/webapp || exit
sudo unzip webapp.zip
sudo rm webapp.zip

# Create new group and user if they don't exist
sudo groupadd -f csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225/webapp -m csye6225
echo "User Created"

# Change ownership of /opt/csye6225/
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 775 /opt/csye6225/