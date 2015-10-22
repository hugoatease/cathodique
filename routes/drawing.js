var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var Boom = require('boom');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/api/drawing',
    handler: function(request, reply) {
      var query = {};
      if (request.query.screened) {
        query.screened = (request.query.screened == 'true');
      }
      var Drawing = request.server.plugins['hapi-mongo-models'].Drawing;
      Drawing.find({'$query': query, '$orderby': {sent: -1}}, function(err, result) {
        if (err) return Boom.notFound();
        return reply(result);
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/api/drawing/{id}',
    handler: function(request, reply) {
      var Drawing = request.server.plugins['hapi-mongo-models'].Drawing;
      Drawing.findById(request.params.id, function(err, result) {
        if (!result) return Boom.notFound();
        return reply(result);
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/api/drawing/{id}/screened',
    handler: function(request, reply) {
      var Drawing = request.server.plugins['hapi-mongo-models'].Drawing;
      Drawing.findByIdAndUpdate(request.params.id, {'$set': {screened: true}}, function(err, result) {
        return reply(result);
      });
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
          sent: new Date(),
          device: request.payload.device,
          author: request.payload.author
        }, function(err, drawing) {
          return reply(drawing[0]);
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
