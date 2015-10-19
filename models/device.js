var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;

var Device = BaseModel.extend({
  constructor: function(attrs) {
    ObjectAssign(this, attrs);
  },
});

Device._collection = 'devices';
Device.schema = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = Device;
