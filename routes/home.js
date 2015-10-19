module.exports = function(server) {
  server.route({
    method: 'GET',
    path: '/{device}',
    handler: function(request, reply) {
      reply.view('home', {
        device: request.params.device
      });
    }
  })
}
