'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sns = new AWS.SNS();
const { Chance } = require('chance');
const chance = new Chance();

exports.handler = (parsedOrder) => {

  const topic = 'arn:aws:sns:us-west-2:363223802314:slack-orders.fifo';

  const { storeName, clientId, userOrder: { meal, drink, side, cost } } = parsedOrder;

  const orderDetails = {
    id: chance.guid(),
    storeName,
    clientId,
    userOrder: { meal, drink, side, cost },
  };

  const payload = {
    Message: JSON.stringify(orderDetails),
    TopicArn: topic,
    MessageGroupId: parsedOrder.storeName.replace(' ', '_'),
  };

  sns.publish(payload).promise()
    .then(data => console.log('CUSTOMER ORDER DATA:', data))
    .catch(err => console.log('ERROR IN CUSTOMER ORDER', err));
};
