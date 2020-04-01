ls
cd /home/ubuntu
ls
pwd
sudo npm i pm2 -g
cd webapp
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/webapp/cloudwatch-agent-config.json -s
sudo pm2 start server.js
echo "hi"
echo $MYSQL_DATABASE
echo $SQS_QUEUE_URL