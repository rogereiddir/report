#
yum remove -y epel-release
yum install -y epel-release

#
yum install xorg-x11-server-Xvfb

##Install Redis Database
yum install redis -y

##Install Nodejs
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash - ; sudo yum install nodejs -y

##Install Postgresql
yum install postgresql-server postgresql-contrib
postgresql-setup initdb
systemctl start postgresql
systemctl enable postgresql

su postgres  -c "createuser -d -a -w root"
su postgres  -c "createdb  report"
psql -d report  -t -A -F "," -c "ALTER USER root WITH PASSWORD 'p7gtR9ae2qtXDMX2'"

##Install Chrome browser
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum install ./google-chrome-stable_current_*.rpm

##Install Git
yum install git

##Install NPM Packages
npm i -g pm2
npm install -g @nestjs/cli
