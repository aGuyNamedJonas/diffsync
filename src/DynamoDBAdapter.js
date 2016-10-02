/**
 * A dumb in-memory data store. Do not use in production.
 * Only for demo purposes.
 * @param {Object} cache
 */
var AWS = require("aws-sdk");
var fs = require('fs');

var DynamoDBAdapter = function(){
  AWS.config.update({
     region: "eu-central-1b",
     endpoint: "http://localhost:8000"
  });

  // Create new DB connection
  this.db = new AWS.DynamoDB.DocumentClient();
};

/**
 * Get the data specified by the id
 * @param  {String/Number}   id ID for the requested data
 * @param  {Function} cb
 */
DynamoDBAdapter.prototype.getData = function(id, cb){
  var queryParams = {
    TableName: "DiffSync",
    Key: {"docID": id}
  };

  this.db.get(queryParams, (err, data) => {
    if(err){
      cb(JSON.stringyfy(err, null, 2), null);
    } else {
      if(JSON.stringify(data) === '{}') {
        console.log('Did not find what you were looking for: ', data);
        cb(null, {});
      } else {
        console.log('Found what you were looking for: ');
        console.dir(data);
        cb(null, JSON.parse(data.Item.data));
      }
    }
  });
};

/**
 * Stores `data` at `id`
 */
DynamoDBAdapter.prototype.storeData = function(id, data, cb){
  var unixTime = Math.floor(Date.now() / 1000);

  var queryParams = {
    TableName: "DiffSync",
    Item: {
      "docID": id,
      "last-modified": unixTime,
      "data": JSON.stringify(data)
    }
  };

  this.db.put(queryParams, (err, data) => {
    if(cb){ cb(null); }
  });
};

module.exports = DynamoDBAdapter;
