var Hapi = require('hapi');
var server = new Hapi.Server();
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var fs = require('fs');

server.register([
  {
    register: require('hapi-mongo-models'),
    options: {
      mongodb: {url: 'mongodb://localhost:27017/cathodique'},
      autoIndex: true,
      models: {
        Drawing: './models/drawing'
      }
    }
  }
], function(err) {
  if (err) return console.log(err);

  var gfs = Grid(server.plugins['hapi-mongo-models'].BaseModel.db, mongo);
  var Drawing = server.plugins['hapi-mongo-models'].Drawing;

  Drawing.find({'$query': {}, '$orderby': {sent: 1}}, function(err, drawings) {
    drawings.forEach(function(drawing) {
      var blobStream = gfs.createReadStream({'_id': drawing.blobId});
      var fileStream = fs.createWriteStream('output/' + drawing['_id'] + '.png');
      blobStream.pipe(fileStream);
      fileStream.on('finish', function() {
        console.log(drawing.sent)
        console.log(drawing._id + ' finished');
      });
    }.bind(this));
  });
});
