/**
 * A dumb in-memory data store. Do not use in production.
 * Only for demo purposes.
 * @param {Object} cache
 */
var AWS = require("aws-sdk");

var DynamoDBAdapter = function(dbConnection){
  this.db = dbConnection;
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
      // Call callback w/ an error
      cb(JSON.stringyfy(err, null, 2), null);
    } else {
      if(JSON.stringify(data) === '{}') {
        // No document with this ID was found
        cb(null, {});
      } else {
        // Return document data
        cb(null, JSON.parse(data.Item.data));
      }
    }
  });
};

/**
 * Stores `data` at `id`
 */
DynamoDBAdapter.prototype.storeData = function(id, data, cb){
  var mTime = Math.floor(Date.now() / 1000);

  var queryParams = {
    TableName: "DiffSync",
    Item: {
      "docID": id,
      "last-modified": mTime,
      "data": JSON.stringify(data)
    }
  };

  this.db.put(queryParams, (err, data) => {
    if(cb){ cb(null); }
  });
};

module.exports = DynamoDBAdapter;
