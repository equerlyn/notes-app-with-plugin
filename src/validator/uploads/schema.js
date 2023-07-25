const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  // properti content-type yang berada di readable.hapi.headers
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = { ImageHeadersSchema };
