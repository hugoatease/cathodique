var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var Boom = require('boom');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/image/{imageId}',
    handler: function(request, reply) {
      var gfs = Grid(request.server.plugins['hapi-mongo-models'].BaseModel.db, mongo);
      gfs.findOne({_id: request.params.imageId}, function(err, file) {
        if (!file) return reply(Boom.notFound());
        var stream = gfs.createReadStream({_id: request.params.imageId});
        reply(stream).header('Content-Type', file.contentType);
      });
    },
    config: {
      id: 'image'
    }
  });
}
