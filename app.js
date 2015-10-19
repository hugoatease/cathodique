var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

server.register([
  {
    register: require('hapi-mongo-models'),
    options: {
      mongodb: {url: 'mongodb://localhost:27017/cathodique'},
      autoIndex: true,
      models: {
        Drawing: './models/drawing',
        Device: './models/device'
      }
    }
  },
  require('./routes')
], function(err) {
  if (err) return console.log(err);

  server.start(function() {
    console.log('Server running at: ', server.info.uri);
  });
});
