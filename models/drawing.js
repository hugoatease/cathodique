var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;

var Drawing = BaseModel.extend({
  constructor: function(attrs) {
    ObjectAssign(this, attrs);
  },
});

Drawing._collection = 'drawings';
Drawing.schema = Joi.object().keys({
  blobId: Joi.objectId().required(),
  sent: Joi.date().iso().required(),
  screened: Joi.boolean().required(),
  device: Joi.string().required(),
  author: Joi.string()
});

module.exports = Drawing;
