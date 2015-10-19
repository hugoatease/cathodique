module.exports = function(server) {
  server.route({
    method: 'GET',
    handler: function(request, reply) {
      var Device = request.server.plugins['hapi-mongo-models'].Device;
      
    }
  })
}
