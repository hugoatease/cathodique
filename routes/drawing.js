var mongo = require('mongodb');
var Grid = require('gridfs-stream');

module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/api/drawing',
    handler: function(request, reply) {
      reply('HELLO');
    }
  });

  server.route({
    method: 'POST',
    path: '/api/drawing',
    handler: function(request, reply) {
      var gfs = Grid(request.server.plugins['hapi-mongo-models'].BaseModel.db, mongo);
      var gfsWrite = gfs.createWriteStream({
        content_type: request.payload.image.hapi.headers['content-type']
      });
      request.payload.image.pipe(gfsWrite);

      gfsWrite.on('close', function(file) {

        reply();
      });
    },
    config: {
      payload: {
        output: 'stream'
      }
    }
  });
}
