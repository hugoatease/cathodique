module.exports.register = function(server, options, next) {
  require('./device')(server);
  require('./drawing')(server);
  require('./image')(server);
  next();
}

module.exports.register.attributes = {
  name: 'routes'
}
