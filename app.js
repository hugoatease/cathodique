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
        Drawing: './models/drawing'
      }
    }
  },
  require('./routes'),
  require('inert'),
  require('vision')
], function(err) {
  if (err) return console.log(err);

  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: 'static/'
      }
    }
  });

  server.views({
    engines: {ejs: require('ejs')},
    relativeTo: __dirname,
    path: 'views',
    isCached: false
  })

  server.start(function() {
    console.log('Server running at: ', server.info.uri);
  });
});
