var mongo = require('mongodb');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;
  ObjectID = mongo.ObjectID;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('chesspositionsdb', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'chesspositionsdb' database");
    db.collection('sets', {strict:true}, function(err, collection) {
      if (err) {
        console.log("Cannot find database");
      }
    });
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving set: ' + id);
  db.collection('sets', function(err, collection) {
    collection.findOne({'_id':new ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  db.collection('sets', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addSet = function(req, res) {
  var set = req.body;
  console.log('Adding set: ' + JSON.stringify(set));
  db.collection('sets', function(err, collection) {
    collection.insert(set, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
}

exports.updateSet = function(req, res) {
  var id = req.params.id;
  var set = req.body;
  console.log('Updating set: ' + id);
  console.log(JSON.stringify(set));
  db.collection('sets', function(err, collection) {
    collection.update({'_id':new ObjectID(id)}, set, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating set: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(set);
      }
    });
  });
}

exports.deleteSet = function(req, res) {
  var id = req.params.id;
  console.log('Deleting set: ' + id);
  db.collection('sets', function(err, collection) {
    collection.remove({'_id':new ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  });
}
