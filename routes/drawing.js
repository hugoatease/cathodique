var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var Boom = require('boom');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/api/drawing',
    handler: function(request, reply) {
      var Drawing = request.server.plugins['hapi-mongo-models'].Drawing;
      Drawing.find({'$query': {}, '$orderby': {sent: -1}}, function(err, result) {
        if (err) return Boom.notFound();
        reply(result);
      })
    }
  });

  server.route({
    method: 'POST',
    path: '/api/drawing',
    handler: function(request, reply) {
      var gfs = Grid(request.server.plugins['hapi-mongo-models'].BaseModel.db, mongo);
      var Drawing = request.server.plugins['hapi-mongo-models'].Drawing;
      var gfsWrite = gfs.createWriteStream({
        content_type: request.payload.image.hapi.headers['content-type']
      });
      request.payload.image.pipe(gfsWrite);

      gfsWrite.on('close', function(file) {
        Drawing.insertOne({
          blobId: file._id,
          screened: false,
          sent: Date(),
          device: request.payload.device,
          author: request.payload.author
        }, function(err, drawing) {
          reply(drawing[0]);
        });
      });
    },
    config: {
      payload: {
        output: 'stream',
        maxBytes: 20971520
      }
    }
  });
}
